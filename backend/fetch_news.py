import os
import logging
import requests
from typing import Optional

from database import create_table, get_connection

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

API_KEY = os.getenv("GNEWS_API_KEY")
URL = "https://gnews.io/api/v4/search"

PARAMS = {
    "q": "crime OR theft OR fraud OR murder OR assault",
    "country": "in",
    "lang": "en",
    "max": 20
}


def fetch_and_store(db_path: Optional[str] = None) -> None:
    if not API_KEY:
        logger.error("GNEWS_API_KEY not set. Export it before running.")
        return

    params = {**PARAMS, "apikey": API_KEY}

    try:
        resp = requests.get(URL, params=params, timeout=10, verify=False)
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException as exc:
        logger.error("Failed to fetch news: %s", exc)
        return

    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        for article in data.get("articles", []):
            title = article.get("title")
            description = article.get("description")
            source_name = article.get("source", {}).get("name")
            url = article.get("url")
            published = article.get("publishedAt")

            try:
                cursor.execute(
                    """
                    INSERT OR IGNORE INTO news
                    (title, description, source, url, published_at)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (title, description, source_name, url, published),
                )
            except Exception:
                logger.exception("Failed to insert article: %s", url)

    logger.info("News fetched and stored.")


if __name__ == "__main__":
    create_table()
    fetch_and_store()
