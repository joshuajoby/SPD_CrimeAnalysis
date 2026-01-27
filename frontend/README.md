# CrimeWatch Frontend

React frontend for CrimeWatch - Structured Crime News & Safety Insights

## Tech Stack

- React 18
- Vite
- JavaScript with SWC
- Tailwind CSS
- React Router
- Axios
- Recharts

## Setup Instructions

### Install Dependencies

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Results.jsx
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Features

### Home Page
- Hero section with CrimeWatch branding
- Search bar for region/state selection
- Feature cards highlighting key capabilities

### Results Page
- Region-specific crime insights
- Top crimes to look out for (highlight cards)
- Interactive charts:
  - Bar chart showing crime categories
  - Pie chart showing crime distribution
- Latest crime news section:
  - Displays 5 news articles
  - Fetches real data from backend API
  - Scrollable news feed

## API Integration

The frontend connects to the Flask backend through a proxy configuration in `vite.config.js`.

- **Backend URL**: `http://localhost:5000`
- **API Endpoint**: `/api/news`
- **Response Format**:
  ```json
  [
    {
      "title": "string",
      "source": "string",
      "published_at": "string",
      "url": "string"
    }
  ]
  ```

## Color Scheme

- Primary: Dark Blue (#1e3a8a)
- Accent: Red (#dc2626)
- Background: Light Gray (#f9fafb)
- Text: Gray shades for hierarchy

## Notes

- Backend must be running on port 5000 for API calls to work
- The app is fully responsive and works on mobile, tablet, and desktop
- Charts use dummy data for demonstration purposes
- News section fetches real data from the backend
