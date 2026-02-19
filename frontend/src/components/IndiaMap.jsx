import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Custom "Glow" Marker using CSS
const createGlowIcon = () => new L.DivIcon({
    className: 'glow-marker',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -10]
});

// Mock Data for India
const crimeHotspots = [
    { id: 1, lat: 28.6139, lng: 77.2090, city: 'New Delhi', risk: 'High', incidents: 142 },
    { id: 2, lat: 19.0760, lng: 72.8777, city: 'Mumbai', risk: 'Moderate', incidents: 89 },
    { id: 3, lat: 12.9716, lng: 77.5946, city: 'Bangalore', risk: 'Low', incidents: 45 },
    { id: 4, lat: 13.0827, lng: 80.2707, city: 'Chennai', risk: 'Moderate', incidents: 76 },
    { id: 5, lat: 22.5726, lng: 88.3639, city: 'Kolkata', risk: 'High', incidents: 112 },
    { id: 6, lat: 17.3850, lng: 78.4867, city: 'Hyderabad', risk: 'Low', incidents: 34 },
    { id: 7, lat: 23.0225, lng: 72.5714, city: 'Ahmedabad', risk: 'Moderate', incidents: 55 },
    { id: 8, lat: 26.8467, lng: 80.9462, city: 'Lucknow', risk: 'High', incidents: 98 },
    { id: 9, lat: 18.5204, lng: 73.8567, city: 'Pune', risk: 'Low', incidents: 20 },
    { id: 10, lat: 15.2993, lng: 74.1240, city: 'Goa', risk: 'Low', incidents: 15 },
]

function IndiaMap() {
    return (
        <div className="relative w-full h-[700px] bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-700/50 group">

            <MapContainer
                center={[22.5937, 78.9629]}
                zoom={5}
                scrollWheelZoom={false}
                zoomControl={false}
                className="w-full h-full z-0"
                style={{ background: '#0f172a' }} // Dark Slate
            >
                {/* CartoDB Dark Matter Tiles */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />

                {crimeHotspots.map(city => (
                    <Marker
                        key={city.id}
                        position={[city.lat, city.lng]}
                        icon={createGlowIcon()}
                    >
                        <Popup className="custom-popup" closeButton={false}>
                            <div className="p-3 min-w-[120px] text-center">
                                <h3 className="font-bold text-amber-500 text-base mb-1">{city.city}</h3>
                                <div className="text-xs text-slate-300 font-medium">
                                    {city.risk} Risk • {city.incidents} Reports
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Floating Badge: Top Left */}
            <div className="absolute top-6 left-6 z-[1000]">
                <div className="bg-slate-800/90 backdrop-blur border border-slate-600 px-4 py-2 rounded-lg shadow-lg">
                    <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">PAN-INDIA PRESENCE</span>
                </div>
            </div>

            {/* Floating Badge: Top Right */}
            <div className="absolute top-6 right-6 z-[1000]">
                <div className="bg-amber-600/90 backdrop-blur px-3 py-1 rounded-md shadow-lg">
                    <span className="text-sm font-bold text-white">28+ States</span>
                </div>
            </div>

            {/* Interactive Instruction Overlay (Bottom Center) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="bg-slate-900/80 backdrop-blur px-4 py-1 rounded-full border border-slate-700">
                    <span className="text-xs text-slate-400">Hover over nodes • Click to zoom</span>
                </div>
            </div>
        </div>
    )
}

export default IndiaMap
