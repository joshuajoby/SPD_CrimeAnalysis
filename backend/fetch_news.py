import requests
import sqlite3
from database import create_table, get_connection

API_KEY = "c210cdd8db8ed00fce98f7e1d1951a79"
URL = "https://gnews.io/api/v4/search"

PARAMS = {
    "q": "crime OR theft OR fraud OR murder OR assault",
    "country": "in",
    "lang": "en",
    "max": 20,
    "apikey": API_KEY
}

def fetch_and_store():
    response = requests.get(URL, params=PARAMS, verify=False)
    data = response.json()

    conn = get_connection()
    cursor = conn.cursor()

    for article in data.get("articles", []):
        try:
            cursor.execute("""
                INSERT OR IGNORE INTO news
                (title, description, source, url, published_at)
                VALUES (?, ?, ?, ?, ?)
            """, (
                article.get("title"),
                article.get("description"),
                article["source"]["name"],
                article.get("url"),
                article.get("publishedAt")
            ))
        except Exception as e:
            print("Error:", e)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_table()
    fetch_and_store()
    print("News fetched and stored.")
