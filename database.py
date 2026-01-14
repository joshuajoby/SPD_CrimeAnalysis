import sqlite3

def get_connection():
    return sqlite3.connect("crime_data.db")

def create_table():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            source TEXT,
            url TEXT UNIQUE,
            published_at TEXT
        )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_table()
