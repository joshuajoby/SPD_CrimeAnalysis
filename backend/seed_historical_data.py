import sqlite3
import random
from datetime import datetime, timedelta
import os
import uuid

DB_PATH = os.path.join(os.path.dirname(__file__), "crime_data.db")

STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir"
]

CRIME_TYPES = ["theft", "fraud", "murder", "assault", "rape", "drugs", "kidnapping", "general"]
CREDIBILITY = ["High", "Medium", "Low"]
SOURCES = ["The Hindu", "Times of India", "Hindustan Times", "Indian Express", "NDTV", "Local News", "State Police Bulletin"]

HEADLINE_TEMPLATES = [
    "Major {crime} reported in {state} district",
    "Police apprehend suspects in {state} {crime} case",
    "Investigation ongoing for {crime} incident in {state}",
    "Increase in {crime} rates concerns {state} residents",
    "Special task force busts {crime} ring in {state}",
    "{state} authorities report breakthrough in recent {crime}",
    "Shocking {crime} incident shakes {state} community",
    "New policies implemented in {state} to combat {crime}"
]

DESCRIPTIONS = [
    "Authorities have launched a full-scale investigation into the matter after receiving multiple tips from local informants.",
    "The suspects were apprehended late last night following a lengthy stakeout by the regional crime branch.",
    "Local residents have expressed deep concern over the rising trend of such incidents in the area over the past few months.",
    "Following a series of similar reports, a dedicated team has been assigned to coordinate across district lines to track down the perpetrators.",
    "Forensic teams have gathered substantial evidence from the scene, and preliminary reports suggest a coordinated effort.",
    "The state police chief addressed the media today, assuring the public that all possible resources are being utilized to ensure safety.",
    "A massive crackdown has been initiated resulting in several key arrests that authorities believe will dismantle the network.",
    "Community leaders are urging citizens to remain vigilant and report any suspicious activities to the newly established hotline."
]

def random_date(start_year=2010, end_year=2026):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 2, 24)
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = random.randrange(int_delta)
    return start + timedelta(seconds=random_second)

def seed_database(num_records=5000):
    print(f"Connecting to database at {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # We will generate a large number of records to ensure every state and year has data
    records = []
    
    print(f"Generating {num_records} historical records from 2010 to 2026...")
    for _ in range(num_records):
        state = random.choice(STATES)
        crime = random.choice(CRIME_TYPES)
        source = random.choice(SOURCES)
        cred = random.choices(CREDIBILITY, weights=[60, 30, 10])[0] # Mostly High/Medium
        
        pub_date = random_date()
        date_str = pub_date.strftime('%Y-%m-%dT%H:%M:%SZ')
        
        title_template = random.choice(HEADLINE_TEMPLATES)
        title = title_template.format(crime=crime.capitalize(), state=state)
        
        desc = random.choice(DESCRIPTIONS)
        url = f"https://news.example.com/archive/{pub_date.year}/{pub_date.month}/{uuid.uuid4().hex[:8]}"
        
        # We reuse the fallback images from fetch_news
        images = [
            "https://images.unsplash.com/photo-1557053503-0c217ca26674?q=80&w=2074&auto=format&fit=crop", 
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop", 
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", 
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop", 
            "https://images.unsplash.com/photo-1624969862644-791f3dc98927?q=80&w=2070&auto=format&fit=crop", 
            "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=1974&auto=format&fit=crop", 
            "https://images.unsplash.com/photo-1614064641938-3e852943af8e?q=80&w=2070&auto=format&fit=crop", 
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop", 
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop", 
            "https://images.unsplash.com/photo-1590422749875-4523fa5d9f0a?q=80&w=1974&auto=format&fit=crop"
        ]
        img = random.choice(images)
        
        records.append((title, desc, source, url, date_str, crime, state, cred, img))
        
    print("Inserting into database...")
    try:
        cursor.executemany("""
            INSERT OR IGNORE INTO news 
            (title, description, source, url, published_at, crime_type, location, credibility, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, records)
        conn.commit()
        print(f"Successfully injected {cursor.rowcount} historical records!")
    except Exception as e:
        print(f"Error inserting records: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    seed_database(6000) # Inject 6,000 records
