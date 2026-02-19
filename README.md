# 🚨 CrimeWatch — Advanced Intelligence & Surveillance Platform

A state-of-the-art, data-driven crime analysis and news monitoring platform for India. Designed for both public awareness and law enforcement intelligence, CrimeWatch leverages AI to classify incidents, assess credibility, and visualize national safety patterns.

---

## 🛡️ Admin Intelligence Portal [NEW]
Access a restricted multi-admin environment (Stealth Mode) designed for specialized personnel.
- **Personnel Registration**: Complete officer onboarding with Rank, Badge ID, and Departmental mapping.
- **Officer Dashboard**: Personalized command center for each administrator showing active reports and credentials.
- **Incident Management**: Tools to view, verify, resolve, or archive reported crimes in real-time.
- **Data Export**: Export intelligence reports to CSV for external analysis.

## 📱 Mobile-First Intelligence [NEW]
Optimized for field use and emergency monitoring on any device.
- **Responsive Command Sidebars**: Collapse-ready navigation for smartphones and tablets.
- **Dynamic Map Scaling**: Interactive India Map scales fluidly from 300px to 500px based on device resolution.
- **Touch-Optimized Registration**: Single-column vertical stacking for rapid data entry on mobile.

---

## ✨ Core Features

### 📍 National Risk Visualization
- **Interactive India Map**: Real-time plotting of incidents across 1,400+ nodes.
- **Risk-Coded Markers**: Visual priority mapping (Red: Violent, Blue: Property, Emerald: Safe).
- **Cluster Intelligence**: Summary of regional safety scores on hover.

### 🔍 AI Credibility Engine
- **Source Verification**: Automated checks against a whitelist of trusted national news outlets.
- **Sentiment & Scrutiny**: Detection of sensationalist language vs. factual reporting.
- **Metadata Scraping**: Real-time extraction of article summaries and imagery.

### 📊 Performance Analytics
- **Live Intelligence Feed**: Automated scraping of 50+ news nodes per cycle.
- **Trend Charts**: Distribution analysis by crime type and frequency.
- **Regional Scorecards**: Transparency metrics for city-specific safety levels.

---

## 🏗️ Technical Stack

**Frontend Command Center:**
- **React 18 + Vite**: Ultra-fast build and runtime performance.
- **Leaflet & React-Leaflet**: Sophisticated geographic data mapping.
- **Framer Motion**: Premium, agency-grade micro-animations.
- **Lucide Icons**: High-fidelity iconography set.
- **Tailwind CSS**: Custom "Intelligence Agency" theme (Slate-950/Amber/Indigo).

**Backend Core:**
- **Python / Flask**: High-concurrency API layer.
- **SQLite**: Robust local intelligence storage.
- **GNews Integration**: Real-time news aggregation pipeline.
- **Scrapy-style Scrapers**: Meta-data extraction for depth analytics.

---

## 🚀 Deployment & Access

### Public Portal
Live Static Preview: [crime-watch-spd.surge.sh](http://crime-watch-spd.surge.sh)

### Full Intelligence Preview (Localtunnel)
Exposes the local backend for real-time map plotting and auth:
```bash
# Start backend
python app.py
# Start tunnel
npx localtunnel --port 5173
```
*Note: Requires Tunnel Password (Host Machine Public IP).*

---

## 📚 Personnel Taxonomy (Supported Crime Types)
- **Violent Crimes**: Murder, Homicide, Assault, Kidnapping.
- **Property Crimes**: Theft, Robbery, Burglary, Vandalism.
- **White Collar**: Fraud, Cyber Crime, Scams, Corruption.

---

**Built with Precision for SPD • February 2026**


