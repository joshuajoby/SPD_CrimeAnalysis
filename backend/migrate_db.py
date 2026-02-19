import sqlite3
import os

DB_FILENAME = os.getenv("CRIME_DB", "crime_data.db")

def migrate():
    print(f"Migrating database: {DB_FILENAME}")
    conn = sqlite3.connect(DB_FILENAME)
    cursor = conn.cursor()
    
    try:
        # Check if column exists
        cursor.execute("PRAGMA table_info(news)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if 'image_url' not in columns:
            print("Adding 'image_url' column...")
            cursor.execute("ALTER TABLE news ADD COLUMN image_url TEXT")
            conn.commit()
            print("Migration successful.")
        else:
            print("'image_url' column already exists.")
            
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
