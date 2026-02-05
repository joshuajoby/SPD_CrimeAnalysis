import os
import sqlite3
from typing import Optional

DB_FILENAME = os.getenv("CRIME_DB", "crime_data.db")


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
                credibility TEXT
            )
            """
        )


if __name__ == "__main__":
    create_table()
