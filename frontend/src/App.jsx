import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Results from './pages/Results'
import CredibilityCheck from './pages/CredibilityCheck'
import ReportCrime from './pages/ReportCrime'
import EmergencyContacts from './pages/EmergencyContacts'


import Admin from './pages/Admin'
import Resources from './pages/Resources'

import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<Home />} /> {/* Map is now on Home */}
        <Route path="/dashboard" element={<Navigate to="/results/All" replace />} />
        <Route path="/results/:region" element={<Results />} />
        <Route path="/verify" element={<CredibilityCheck />} />
        <Route path="/report" element={<ReportCrime />} />
        <Route path="/emergency" element={<EmergencyContacts />} />

        <Route path="/resources" element={<Resources />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
