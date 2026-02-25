import os
import sqlite3
from typing import Optional

DB_FILENAME = os.getenv("CRIME_DB", os.path.join(os.path.dirname(__file__), "crime_data.db"))


def get_connection(db_path: Optional[str] = None) -> sqlite3.Connection:
    """Return an sqlite3 connection. Uses `CRIME_DB` env var if present.

    The connection uses `sqlite3.Row` as the row factory for dict-like access.
    """
    path = db_path or DB_FILENAME
    conn = sqlite3.connect(path, detect_types=sqlite3.PARSE_DECLTYPES)
    conn.row_factory = sqlite3.Row
    return conn


def create_table(db_path: Optional[str] = None) -> None:
    """Create the `news` table if it doesn't exist.

    Uses a context manager so the connection is always closed and commits
    automatically.
    """
    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS news (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                description TEXT,
                source TEXT,
                url TEXT UNIQUE,
                published_at TEXT,
                crime_type TEXT,
                location TEXT,
                credibility TEXT,
                image_url TEXT
            )
            """
        )

        # For development ease, we previously recreated the users table to ensure new schema
        # but this drops all accounts. Removed DROP TABLE statement.
        
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'admin',
                full_name TEXT,
                badge_number TEXT,
                rank TEXT,
                department TEXT,
                contact TEXT,
                email TEXT
            )
            """
        )

def seed_admin():
    """Create a default admin user if one doesn't exist."""
    from werkzeug.security import generate_password_hash
    
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT count(*) FROM users WHERE username = ?", ('admin',))
        if cursor.fetchone()[0] == 0:
            print("Seeding default admin user...")
            # Default password: 'admin'
            pw_hash = generate_password_hash('admin')
            cursor.execute("""
                INSERT INTO users (
                    username, password_hash, role, 
                    full_name, department, contact, email
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """, ('admin', pw_hash, 'admin', 'System Administrator', 'IT Security', '+91 98765 43210', 'admin@company.in'))
            conn.commit()


if __name__ == "__main__":
    create_table()
    seed_admin()
