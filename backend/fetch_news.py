import logging
import requests
import xml.etree.ElementTree as ET
import re
from bs4 import BeautifulSoup  # Added for robust scraping
from typing import Optional
from datetime import datetime
from email.utils import parsedate_to_datetime

from database import create_table, get_connection

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Google News RSS URL for India Crime (Last 24h)
RSS_URL = "https://news.google.com/rss/search?q=crime+india+when:24h&hl=en-IN&gl=IN&ceid=IN:en"

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def fetch_and_store(db_path: Optional[str] = None) -> None:
    logger.info("Fetching news from Google RSS...")
    
    try:
        resp = requests.get(RSS_URL, timeout=15)
        resp.raise_for_status()
    except requests.RequestException as exc:
        logger.error("Failed to fetch RSS feed: %s", exc)
        return

    try:
        root = ET.fromstring(resp.content)
    except ET.ParseError as exc:
        logger.error("Failed to parse XML: %s", exc)
        return

    new_count = 0
    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        
        # Iterate over <item> tags in the RSS feed
        for item in root.findall(".//item"):
            title = item.findtext("title")
            link = item.findtext("link")
            pub_date_str = item.findtext("pubDate")
            description = item.findtext("description")
            source = item.findtext("source") or "Google News"

            if not title or not link:
                continue

            # Parse Publication Date
            published_at = None
            if pub_date_str:
                try:
                    dt = parsedate_to_datetime(pub_date_str)
                    published_at = dt.strftime('%Y-%m-%dT%H:%M:%SZ')
                except Exception:
                    published_at = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

            # Clean Description (remove HTML tags)
            clean_desc = ""
            if description:
                # Remove all HTML tags
                clean_desc = re.sub(r'<[^>]+>', '', description)
                # Unescape HTML entities (e.g. &nbsp; -> space)
                import html
                clean_desc = html.unescape(clean_desc)
                # Remove extra whitespace
                clean_desc = " ".join(clean_desc.split())

            # SCRAPE METADATA (Image & Better Description)
            image_url = None
            try:
                with requests.Session() as session:
                    # 1. Resolve Redirect to get Real URL
                    # Google News links are wrappers. We MUST resolve them to scrape the actual site.
                    headers = {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    }
                    
                    # First request to get the redirect text or location
                    # Allow redirects=True to let requests handle 301/302 automatically
                    art_resp = session.get(link, headers=headers, timeout=10, verify=False, allow_redirects=True)
                    
                    if art_resp.status_code == 200:
                        soup = BeautifulSoup(art_resp.text, 'html.parser')
                        
                        # Check if we are still on google news (sometimes it doesn't redirect if it detects bot)
                        if "news.google.com" in art_resp.url:
                            # Try to find the 'opening' link if stuck on an intermediate page
                             link_tag = soup.find('a', href=True, text=re.compile(r'Open', re.I))
                             if link_tag:
                                 real_link = link_tag['href']
                                 art_resp = session.get(real_link, headers=headers, timeout=10, verify=False)
                                 soup = BeautifulSoup(art_resp.text, 'html.parser')

                        # Try og:image first
                        og_image = soup.find('meta', property='og:image')
                        if og_image and og_image.get('content'):
                            image_url = og_image['content']
                        
                        # Fallback to twitter:image
                        if not image_url:
                            twitter_image = soup.find('meta', name='twitter:image')
                            if twitter_image and twitter_image.get('content'):
                                image_url = twitter_image['content']

                        # FILTER GENERIC IMAGES
                        if image_url:
                             if "google" in image_url.lower() or "gstatic" in image_url.lower() or "favicon" in image_url.lower():
                                 image_url = None # Reject generic images

                        # Fallback to first significant image in the body
                        if not image_url:
                            images = soup.find_all('img')
                            for img in images:
                                src = img.get('src')
                                # Simple heuristic: Must be absolute http, valid extension, and not small icon
                                if src and src.startswith('http') and any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                                     # Filter out common logo names
                                     if "logo" not in src.lower() and "icon" not in src.lower():
                                         image_url = src
                                         break

            except Exception as e:
                logger.warning(f"Could not scrape metadata for {link}: {e}")

            # FINAL FALLBACK: Random Theme Image
            # If we still don't have an image, pick one from our curated high-quality list
            if not image_url:
                import random
                # List of high-quality, relevant Unsplash images (Crime, Technology, India, Police, Cyber)
                fallback_images = [
                    "https://images.unsplash.com/photo-1557053503-0c217ca26674?q=80&w=2074&auto=format&fit=crop", # Cyber map
                    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop", # Globe network
                    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", # Server room
                    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop", # Matrix code
                    "https://images.unsplash.com/photo-1624969862644-791f3dc98927?q=80&w=2070&auto=format&fit=crop", # India Map styled
                    "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=1974&auto=format&fit=crop", # Analysis
                    "https://images.unsplash.com/photo-1614064641938-3e852943af8e?q=80&w=2070&auto=format&fit=crop", # Blue abstract
                    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop", # Coding screen
                    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop", # News generic
                    "https://images.unsplash.com/photo-1590422749875-4523fa5d9f0a?q=80&w=1974&auto=format&fit=crop"  # Dark tech
                ]
                image_url = random.choice(fallback_images)

            # ANALYZE CONTENT WITH QUOTA THROTTLING
            import time
            time.sleep(4.5)  # 60s / 15 req = 4s. Buffer to stay strictly below 15 Requests Per Minute limit.
            from news_logic import analyze_news
            analysis = analyze_news(title, clean_desc, source)

            try:
                cursor.execute(
                    """
                    INSERT OR IGNORE INTO news
                    (title, description, source, url, published_at, crime_type, location, credibility, image_url)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (title, clean_desc, source, link, published_at, 
                     analysis['crime_type'], analysis['location'], analysis['credibility'], image_url),
                )
                if cursor.rowcount > 0:
                    new_count += 1
            except Exception:
                logger.exception("Failed to insert article: %s", link)

    logger.info(f"News fetch complete. {new_count} new articles stored.")


if __name__ == "__main__":
    create_table()
    fetch_and_store()
