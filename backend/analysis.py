import sqlite3
from classify import detect_crime_type, detect_location
from credibility import calculate_credibility

def process_news():
    conn = sqlite3.connect("crime_data.db")
    cursor = conn.cursor()

    # Add columns if not present
    try:
        cursor.execute("ALTER TABLE news ADD COLUMN crime_type TEXT")
        cursor.execute("ALTER TABLE news ADD COLUMN location TEXT")
        cursor.execute("ALTER TABLE news ADD COLUMN credibility TEXT")
    except:
        pass  # columns already exist

    cursor.execute("SELECT id, title, description, source FROM news")
    rows = cursor.fetchall()

    for row in rows:
        news_id, title, description, source = row
        text = (title or "") + " " + (description or "")

        crime_type = detect_crime_type(text)
        location = detect_location(text)

        article = {
            "title": title,
            "description": description,
            "source": source,
            "location": location
        }

        credibility = calculate_credibility(article)

        cursor.execute("""
            UPDATE news
            SET crime_type=?, location=?, credibility=?
            WHERE id=?
        """, (crime_type, location, credibility, news_id))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    process_news()
    print("News processed with crime type, location, and credibility.")
