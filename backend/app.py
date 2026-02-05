from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_connection

app = Flask(__name__)

# Enable CORS for frontend requests
CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173'])


@app.route("/api/news", methods=['GET'])
def get_news():
    """Fetch all news articles with optional filters."""
    crime_type = request.args.get('crime_type')
    location = request.args.get('location')
    credibility = request.args.get('credibility')
    limit = request.args.get('limit', 50, type=int)

    with get_connection() as conn:
        cursor = conn.cursor()
        
        query = """
            SELECT id, title, description, source, published_at, url, 
                   crime_type, location, credibility
            FROM news
            WHERE 1=1
        """
        params = []
        
        if crime_type:
            query += " AND crime_type = ?"
            params.append(crime_type)
        if location:
            query += " AND location = ?"
            params.append(location)
        if credibility:
            query += " AND credibility = ?"
            params.append(credibility)
        
        query += " ORDER BY published_at DESC LIMIT ?"
        params.append(limit)
        
        cursor.execute(query, params)
        rows = cursor.fetchall()

    news_list = [dict(r) for r in rows]
    return jsonify(news_list)


@app.route("/api/statistics", methods=['GET'])
def get_statistics():
    """Get crime statistics: type distribution, counts, credibility breakdown."""
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # Crime type breakdown
        cursor.execute("""
            SELECT crime_type, COUNT(*) as count
            FROM news
            WHERE crime_type IS NOT NULL AND crime_type != 'unknown'
            GROUP BY crime_type
            ORDER BY count DESC
        """)
        crime_stats = [{'name': r[0], 'value': r[1]} for r in cursor.fetchall()]
        
        # Credibility breakdown
        cursor.execute("""
            SELECT credibility, COUNT(*) as count
            FROM news
            WHERE credibility IS NOT NULL
            GROUP BY credibility
            ORDER BY count DESC
        """)
        credibility_stats = [{'name': r[0], 'count': r[1]} for r in cursor.fetchall()]
        
        # Total stats
        cursor.execute("SELECT COUNT(*) FROM news")
        total_articles = cursor.fetchone()[0]
        
        cursor.execute("""
            SELECT COUNT(*) FROM news
            WHERE location IS NOT NULL AND location != 'Unknown'
        """)
        articles_with_location = cursor.fetchone()[0]

    return jsonify({
        'crime_types': crime_stats,
        'credibility': credibility_stats,
        'total_articles': total_articles,
        'articles_with_location': articles_with_location
    })


@app.route("/api/locations", methods=['GET'])
def get_locations():
    """Get location-based crime data."""
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # Location breakdown
        cursor.execute("""
            SELECT location, COUNT(*) as count, 
                   SUM(CASE WHEN credibility='High' THEN 1 ELSE 0 END) as high_credibility
            FROM news
            WHERE location IS NOT NULL AND location != 'Unknown'
            GROUP BY location
            ORDER BY count DESC
        """)
        locations = [
            {'name': r[0], 'articles': r[1], 'high_credibility': r[2]}
            for r in cursor.fetchall()
        ]

    return jsonify(locations)


@app.route("/api/credibility-distribution", methods=['GET'])
def get_credibility_distribution():
    """Get credibility distribution with article counts."""
    with get_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT credibility, COUNT(*) as count
            FROM news
            WHERE credibility IS NOT NULL
            GROUP BY credibility
            ORDER BY CASE 
                WHEN credibility='High' THEN 1
                WHEN credibility='Medium' THEN 2
                ELSE 3
            END
        """)
        distribution = [{'name': r[0], 'value': r[1]} for r in cursor.fetchall()]

    return jsonify(distribution)


# Backward compatibility endpoint
@app.route("/news")
def get_news_legacy():
    """Legacy endpoint for backward compatibility."""
    return get_news()


if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)
