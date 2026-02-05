# Backend — SPD_CrimeAnalysis

Quick steps to set up and run the backend (Windows PowerShell). Includes DB setup and how to fetch news.

Prerequisites
- Python 3.9+ installed
- Node/npm for the frontend (if you'll run it)

1) Create and activate a virtual environment

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2) Install Python dependencies

```powershell
pip install -r requirements.txt
```

3) Environment variables
- `GNEWS_API_KEY` — required to fetch articles from gnews.io
- `CRIME_DB` — optional, path to sqlite DB (defaults to `crime_data.db`)

Set them in PowerShell:

```powershell
$env:GNEWS_API_KEY = 'your_api_key_here'
$env:CRIME_DB = 'crime_data.db'  # optional
```

4) Create the database (creates tables if missing)

```powershell
python database.py
```

5) Fetch and store news (requires `GNEWS_API_KEY`)

```powershell
python fetch_news.py
```

6) Run analysis to populate `crime_type`, `location`, and `credibility`

```powershell
python analysis.py
```

7) Start the Flask API

```powershell
python app.py
# Visit: http://127.0.0.1:5000/news
```

Frontend (quick)

```powershell
# from the repository root
cd frontend
npm install
npm run dev
```

Notes
- The backend reads `GNEWS_API_KEY` from the environment. If you do not have an API key, skip `fetch_news.py` and insert sample rows manually.
- The DB file is created in the working directory unless `CRIME_DB` points elsewhere.
- If a script fails, check the activated virtualenv, installed packages, and the environment variables.

If you'd like, I can run lint/tests or attempt to fetch news locally next.