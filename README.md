# 🚨 CrimeWatch — Advanced Crime Intelligence Platform

A professional, data-driven crime analysis and news monitoring platform for India that helps citizens understand crime patterns, access credible news sources, and make informed safety decisions.

## ✨ Key Features

### 📊 Advanced Analytics
- Real-Time Crime Statistics with interactive dashboards
- Beautiful charts (bar, pie, location breakdown) powered by Recharts
- Crime Type Distribution analysis
- AI-powered credibility assessment

### 🔍 Smart Filtering
- Filter by Crime Type (Theft, Fraud, Murder, Assault, etc.)
- Filter by Credibility Level (High, Medium, Low)
- Filter by Location (Region-specific analysis)
- One-click reset to view all articles

### 📍 Location Intelligence
- Location Breakdown Table with credibility percentages
- Geographic crime pattern analysis
- Quality metrics per location
- High-risk area identification

### ✅ Credibility Assessment
- Color-coded credibility badges
- Source reputation tracking
- Sensational language detection
- Official source verification

### 🚀 Real-Time Updates
- GNews API integration
- Latest crime articles from major Indian news sources
- Published date tracking
- Direct links to original articles

### 🛡️ Safety Insights
- Crime pattern analysis
- Risk assessments
- Historical data tracking
- Actionable intelligence

## 🏗️ Technical Architecture

**Backend Components:**
- Flask API with CORS support
- SQLite database for articles
- Crime classification system
- Credibility scoring algorithm
- GNews API integration

**Frontend Components:**
- React 18 with Vite
- Recharts for data visualization
- Tailwind CSS for styling
- Axios for API requests
- React Router for navigation

## 🚀 Quick Start

### Backend
```bash
cd backend
python -m venv .venv
. .venv/Scripts/Activate.ps1
pip install -r requirements.txt
$env:GNEWS_API_KEY = 'your_key'
python database.py
python fetch_news.py
python analysis.py
python app.py  # http://127.0.0.1:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```

## 📊 Features Showcase

- Professional hero homepage with features & CTA
- Real-time analytics dashboard with 4 key metrics
- Interactive crime distribution charts
- Location breakdown table with quality %
- Smart filter system for targeted search
- News feed with metadata (source, date, location)
- Responsive design for all devices

## 📚 Crime Types Supported

- Theft, Robbery, Snatching
- Fraud, Cyber Crime, Scams
- Murder, Homicide, Killing
- Assault, Violence, Rape

## 🔐 Credibility Scoring

- **High**: Trusted sources + official mentions + clear location
- **Medium**: Some official data + mixed language
- **Low**: No official sources + sensational language

## 🌟 Premium Features

- Region-specific crime analysis
- High-quality news filtering
- Credibility-weighted insights
- Historical trend tracking
- Source quality metrics

---

**Last Updated: February 2026**

📖 Project Overview

CrimeRegion is a web-based application that collects crime-related news from public news sources and presents it in a structured and user-friendly format. The system processes unstructured news articles to identify key information such as crime type, location, and credibility using rule-based logic. The application aims to help users quickly understand crime-related incidents and trends without manually analyzing multiple news articles.

This project is developed for academic and educational purposes, demonstrating practical applications of web development, data processing, and rule-based text analysis.

🧱 System Architecture
Frontend (React + Vite + Tailwind) -> HTTP (JSON) -> Backend (Flask API) -> SQLite Database -> Public News API (GNews)

🛠️ Tools & Technologies Used

Backend

Programming Language: Python
Framework: Flask
Database: SQLite
News API: GNews (gnews.io)

Frontend

Framework: React (Vite)
Language: JavaScript (SWC)
Styling: Tailwind CSS
Charts: Recharts
HTTP Client: Axios
Version Control :Git & GitHub

