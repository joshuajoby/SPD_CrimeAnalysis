
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import ReportCrime from './pages/ReportCrime'
import EmergencyContacts from './pages/EmergencyContacts'
import MapPage from './pages/MapPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results/:region" element={<Results />} />
        <Route path="/report" element={<ReportCrime />} />
        <Route path="/emergency" element={<EmergencyContacts />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </Router>
  )
}

export default App
