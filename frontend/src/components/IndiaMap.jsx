
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Card } from './ui/card'

// Custom Marker Icon (Gold/Red for visibility)
const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Mock Data for India
const crimeHotspots = [
    { id: 1, lat: 28.6139, lng: 77.2090, city: 'New Delhi', risk: 'High', incidents: 142, alert: 'Pickpocketing Surge' },
    { id: 2, lat: 19.0760, lng: 72.8777, city: 'Mumbai', risk: 'Moderate', incidents: 89, alert: 'Cyber Fraud' },
    { id: 3, lat: 12.9716, lng: 77.5946, city: 'Bangalore', risk: 'Low', incidents: 45, alert: 'Traffic Congestion' },
    { id: 4, lat: 13.0827, lng: 80.2707, city: 'Chennai', risk: 'Moderate', incidents: 76, alert: 'Public Disturbance' },
    { id: 5, lat: 22.5726, lng: 88.3639, city: 'Kolkata', risk: 'High', incidents: 112, alert: 'Vandalism Reports' },
    { id: 6, lat: 17.3850, lng: 78.4867, city: 'Hyderabad', risk: 'Low', incidents: 34, alert: 'Minor Theft' },
]

function IndiaMap() {
    const [activeCity, setActiveCity] = useState(null)

    return (
        <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900/10">
            <MapContainer
                center={[22.5937, 78.9629]}
                zoom={5}
                scrollWheelZoom={false}
                className="w-full h-full z-0"
                style={{ background: '#f8fafc' }} // Light background to match map tiles
            >
                {/* CartoDB Voyager Tiles (Clean, Professional, Light) */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {crimeHotspots.map(city => (
                    <Marker
                        key={city.id}
                        position={[city.lat, city.lng]}
                        icon={customIcon}
                        eventHandlers={{
                            click: () => setActiveCity(city),
                            mouseover: (e) => e.target.openPopup(),
                            mouseout: (e) => e.target.closePopup()
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="p-1 min-w-[150px]">
                                <h3 className="font-bold text-slate-900 text-lg">{city.city}</h3>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`w-2 h-2 rounded-full ${city.risk === 'High' ? 'bg-red-500' : city.risk === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                                    <span className="text-sm font-semibold text-slate-600">{city.risk} Risk</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-2">Incidents: {city.incidents}</p>
                                <div className="bg-slate-100 p-1 rounded text-xs font-medium text-slate-700 border border-slate-200">
                                    Alert: {city.alert}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Overlay Statistics Card */}
            <div className="absolute top-4 right-4 z-[1000] hidden md:block">
                <Card className="w-64 bg-white/90 backdrop-blur border-slate-200 shadow-xl p-4">
                    <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3">Live Monitoring</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                            <span className="text-slate-500">Active Nodes</span>
                            <span className="font-bold text-blue-600">1,402</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-slate-500">Critical Alerts</span>
                            <span className="font-bold text-red-600">3</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-slate-500">Safe Zones</span>
                            <span className="font-bold text-green-600">89%</span>
                        </li>
                    </ul>
                </Card>
            </div>

            {/* Title Overlay */}
            <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-slate-200">
                <h3 className="font-bold text-slate-900">🇮🇳 National Crime Heatmap</h3>
            </div>
        </div>
    )
}

export default IndiaMap
