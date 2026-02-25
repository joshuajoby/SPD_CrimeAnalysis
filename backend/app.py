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
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    limit = request.args.get('limit', 50, type=int)

    with get_connection() as conn:
        cursor = conn.cursor()
        
        query = """
            SELECT id, title, description, source, published_at, url, 
                   crime_type, location, credibility, image_url
            FROM news
            WHERE 1=1
        """
        params = []
        
        if crime_type:
            query += " AND crime_type = ?"
            params.append(crime_type)
        # Handle exact match or fuzzy match
        if location:
            query += " AND location LIKE ?"
            params.append('%' + location + '%')
        if credibility:
            query += " AND credibility = ?"
            params.append(credibility)
            
        if start_date:
            query += " AND published_at >= ?"
            params.append(start_date + "T00:00:00Z")
        if end_date:
            query += " AND published_at <= ?"
            params.append(end_date + "T23:59:59Z")
        
        query += " ORDER BY id DESC LIMIT ?"
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


@app.route('/api/analyze-url', methods=['POST'])
def analyze_url_endpoint():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        # Scrape the URL with Advanced Headers to Bypass WAFs (like NDTV)
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0'
        }
        import requests
        import urllib3
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        
        try:
            # Scrape the URL
            response = requests.get(url, headers=headers, timeout=12, verify=False)
            
            # Check if we were blocked by the website's security
            if response.status_code == 403 or response.status_code == 400:
                 raise requests.exceptions.RequestException(f"Blocked or Bad Request: {response.status_code}")
                 
            response.raise_for_status()
            
            # Extract Title and Metadata
            import re
            html = response.text
            
            # Helper to extract meta tags
            def get_meta(property_name):
                match = re.search(r'<meta\s+(?:property|name)=["\']' + property_name + r'["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE)
                return match.group(1) if match else None

            title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
            title = get_meta('og:title') or (title_match.group(1) if title_match else "Unknown Title")
            
            image = get_meta('og:image')
            description = get_meta('og:description') or get_meta('description') or "No summary available for this article."
            site_name = get_meta('og:site_name') or url.split('/')[2]
            
        except requests.exceptions.RequestException as e:
            # Fallback if scraping the article completely fails (WAF, 400, timeouts)
            # We skip the scrape and just ask the AI to analyze the URL domain name
            title = "Unknown Article"
            description = f"Content could not be scraped due to security blocks: {e}"
            image = None
            site_name = url.split('/')[2] if '//' in url else "Unknown Source"

        # Analyze Content
        from news_logic import analyze_news
        
        analysis = analyze_news(title, description, source=site_name)
        
        return jsonify({
            "title": title,
            "source": site_name,
            "domain": url.split('/')[2],
            "image": image,
            "summary": description[:300] + "..." if len(description) > 300 else description,
            "score": 85 if analysis['credibility'] == 'High' else 60 if analysis['credibility'] == 'Medium' else 40,
            "status": f"Rated {analysis['credibility']} Trust",
            "factCheck": analysis.get('fact_check', 'Fact check unavailable.'),
            "sentiment": analysis.get('sentiment', 'Neutral'),
            "justification": analysis.get('justification', 'No logic provided.')
        })

    except Exception as e:
        return jsonify({"error": f"Failed to analyze: {str(e)}"}), 500


@app.route("/api/fetch-news-now", methods=['POST'])
def trigger_news_fetch():
    """Manually trigger a news fetch (e.g., for refresh button)."""
    try:
        from fetch_news import fetch_and_store
        fetch_and_store()
        return jsonify({"status": "success", "message": "News fetch triggered."}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/register", methods=['POST'])
def register():
    """Register a new admin user with full profile."""
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # New Fields
    full_name = data.get('full_name')
    department = data.get('department')
    contact = data.get('contact')
    email = data.get('email')
    
    if not username or not password or not full_name:
        return jsonify({"error": "Missing required fields (Username, Password, Name)"}), 400
        
    from werkzeug.security import generate_password_hash
    password_hash = generate_password_hash(password)
    
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO users (
                    username, password_hash, role, 
                    full_name, department, contact, email
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (username, password_hash, 'admin', full_name, department, contact, email))
            conn.commit()
        return jsonify({"message": "Admin registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": "Username or Badge Number already exists"}), 400


@app.route("/api/login", methods=['POST'])
def login():
    """Authenticate user and return token and full profile."""
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400
        
    from werkzeug.security import check_password_hash
    
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT password_hash, role, full_name, department, contact, email 
            FROM users WHERE username = ?
        """, (username,))
        user = cursor.fetchone()
        
    if user and check_password_hash(user[0], password):
        # Create a user profile object to return
        profile = {
            "username": username,
            "role": user[1],
            "full_name": user[2],
            "department": user[3],
            "contact": user[4],
            "email": user[5]
        }
        
        return jsonify({
            "message": "Login successful",
            "token": "mock-jwt-token-for-demo-" + username,
            "user": profile
        }), 200
        
    return jsonify({"error": "Invalid credentials"}), 401


if __name__ == "__main__":
    def auto_fetch():
        import time
        from fetch_news import fetch_and_store
        while True:
            try:
                print("Auto-fetching news in background...")
                fetch_and_store()
            except Exception as e:
                print("Failed to auto-fetch news:", e)
            
            # Wait 300 seconds (5 minutes) before polling news again to respect Gemini API limits
            time.sleep(300)

    import threading
    threading.Thread(target=auto_fetch, daemon=True).start()

    app.run(debug=True, host='127.0.0.1', port=5000)
