import sqlite3
from database import get_connection

def verify():
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # Check Gurugram murder
        cursor.execute("SELECT title, crime_type, location FROM news WHERE title LIKE '%kills%' OR location='Gurugram'")
        rows = cursor.fetchall()
        
        print(f"Found {len(rows)} matching rows:")
        for row in rows:
            print(dict(row))

if __name__ == "__main__":
    verify()
