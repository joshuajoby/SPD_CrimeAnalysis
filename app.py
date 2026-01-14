from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

def get_connection():
    return sqlite3.connect("crime_data.db")

@app.route("/news")
def get_news():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT title, source, published_at, url
        FROM news
        ORDER BY published_at DESC
        LIMIT 20
    """)

    rows = cursor.fetchall()
    conn.close()

    news_list = []
    for row in rows:
        news_list.append({
            "title": row[0],
            "source": row[1],
            "published_at": row[2],
            "url": row[3]
        })

    return jsonify(news_list)

if __name__ == "__main__":
    app.run(debug=True)
