import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, Activity } from 'lucide-react'

// Custom Hook to update map view
function MapUpdater({ incidents }) {
    const map = useMap();
    useEffect(() => {
        if (incidents.length > 0) {
            // Optional: Auto-fit bounds logic could go here
        }
    }, [incidents, map]);
    return null;
}

const getSeverityColor = (count) => {
    if (count > 5) return 'red'; // High Activity
    if (count > 2) return 'amber'; // Medium
    return 'blue'; // Low
};

const PulsingMarker = ({ position, city, count, reports }) => {
    const color = getSeverityColor(count);
    const colorHex = color === 'red' ? '#ef4444' : color === 'amber' ? '#f59e0b' : '#3b82f6';

    // Create a custom DivIcon that supports HTML/CSS animations
    // Create a custom DivIcon that supports HTML/CSS animations
    const icon = L.divIcon({
        className: 'custom-pulsing-icon',
        html: `
            <div style="position: relative; width: 40px; height: 40px;">
                <div style="
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    background-color: ${colorHex};
                    opacity: 0.75;
                    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                "></div>
                <div style="
                    position: relative;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: ${colorHex};
                    border: 3px solid white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 14px;
                    box-shadow: 0 0 20px ${colorHex};
                ">${count}</div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    return (
        <Marker position={position} icon={icon}>
            <Popup className="glass-popup" closeButton={false}>
                <div className="p-0 min-w-[220px] font-sans">
                    <div className={`p-3 rounded-t-lg flex justify-between items-center ${color === 'red' ? 'bg-red-500' : color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'
                        } text-white`}>
                        <h3 className="font-bold text-sm uppercase tracking-wider">{city}</h3>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">{count} Reports</span>
                    </div>
                    <div className="p-3 bg-white/95 backdrop-blur-md max-h-[200px] overflow-y-auto rounded-b-lg shadow-xl">
                        {reports.map((report, idx) => (
                            <div key={idx} className="mb-3 last:mb-0 border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{report.crime_type}</span>
                                    <span className="text-[10px] text-slate-400">{new Date(report.published_at).toLocaleDateString()}</span>
                                </div>
                                <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-slate-800 hover:text-blue-600 line-clamp-2 leading-snug">
                                    {report.title}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </Popup>
        </Marker>
    )
};

// Static Coordinate Lookup (Same as before but ensures full coverage)
const CITY_COORDINATES = {
    'India': [22.5937, 78.9629], 'New Delhi': [28.6139, 77.2090], 'Delhi': [28.6139, 77.2090],
    'Mumbai': [19.0760, 72.8777], 'Bangalore': [12.9716, 77.5946], 'Bengaluru': [12.9716, 77.5946],
    'Chennai': [13.0827, 80.2707], 'Kolkata': [22.5726, 88.3639], 'Hyderabad': [17.3850, 78.4867],
    'Ahmedabad': [23.0225, 72.5714], 'Lucknow': [26.8467, 80.9462], 'Pune': [18.5204, 73.8567],
    'Goa': [15.2993, 74.1240], 'Jaipur': [26.9124, 75.7873], 'Surat': [21.1702, 72.8311],
    'Kanpur': [26.4499, 80.3319], 'Nagpur': [21.1458, 79.0882], 'Indore': [22.7196, 75.8577],
    'Thane': [19.2183, 72.9781], 'Bhopal': [23.2599, 77.4126], 'Visakhapatnam': [17.6868, 83.2185],
    'Patna': [25.5941, 85.1376], 'Vadodara': [22.3072, 73.1812], 'Ghaziabad': [28.6692, 77.4538],
    'Ludhiana': [30.9010, 75.8573], 'Agra': [27.1767, 78.0081], 'Nashik': [19.9975, 73.7898],
    'Ranchi': [23.3441, 85.3096], 'Faridabad': [28.4089, 77.3178], 'Meerut': [28.9845, 77.7064],
    'Rajkot': [22.3039, 70.8022], 'Varanasi': [25.3176, 82.9739], 'Srinagar': [34.0837, 74.7973],
    'Aurangabad': [19.8762, 75.3433], 'Dhanbad': [23.7957, 86.4304], 'Amritsar': [31.6340, 74.8723],
    'Navi Mumbai': [19.0330, 73.0297], 'Allahabad': [25.4358, 81.8463], 'Prayagraj': [25.4358, 81.8463],
    'Howrah': [22.5958, 88.2636], 'Gwalior': [26.2183, 78.1828], 'Jabalpur': [23.1815, 79.9864],
    'Coimbatore': [11.0168, 76.9558], 'Vijayawada': [16.5062, 80.6480], 'Jodhpur': [26.2389, 73.0243],
    'Madurai': [9.9252, 78.1198], 'Raipur': [21.2514, 81.6296], 'Kota': [25.2138, 75.8648],
    'Guwahati': [26.1158, 91.7086], 'Chandigarh': [30.7333, 76.7794], 'Gurugram': [28.4595, 77.0266],
    'Gurgaon': [28.4595, 77.0266], 'Noida': [28.5355, 77.3910], 'Kochi': [9.9312, 76.2673],
    'Trivandrum': [8.5241, 76.9366], 'Thiruvananthapuram': [8.5241, 76.9366],
};

function IndiaMap() {
    const [aggregatedData, setAggregatedData] = useState([]);
    const [totalIncidents, setTotalIncidents] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/news?limit=100'); // Clean fetch
                if (!response.ok) throw new Error("API Error");
                const data = await response.json();

                // Aggregate by City
                const cityGroups = {};

                data.forEach(article => {
                    const city = article.location ? article.location.trim() : 'Unknown';
                    const cityKey = Object.keys(CITY_COORDINATES).find(k => k.toLowerCase() === city.toLowerCase() || city.toLowerCase().startsWith(k.toLowerCase()));

                    const finalCity = cityKey || 'India'; // Fallback to center

                    if (!cityGroups[finalCity]) {
                        cityGroups[finalCity] = {
                            city: finalCity,
                            coords: CITY_COORDINATES[finalCity] || CITY_COORDINATES['India'],
                            count: 0,
                            reports: []
                        };
                    }
                    cityGroups[finalCity].count += 1;
                    cityGroups[finalCity].reports.push(article);
                });

                setAggregatedData(Object.values(cityGroups));
                setTotalIncidents(data.length);
            } catch (error) {
                console.error("Map Data Error:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="relative w-full h-[400px] md:h-[600px] lg:h-[700px] bg-slate-950 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800 group">

            {/* Dark & Mysterious Map Style */}
            <MapContainer
                center={[22.5937, 78.9629]}
                zoom={5}
                scrollWheelZoom={false}
                zoomControl={false}
                attributionControl={false}
                className="w-full h-full z-0 bg-[#0f172a]"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                    opacity={0.8}
                />

                {/* Reference Borders Overlay (Optional) */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
                    opacity={0.6}
                    zIndex={100}
                />

                <MapUpdater incidents={aggregatedData} />

                {aggregatedData.map((cityData) => (
                    <PulsingMarker
                        key={cityData.city}
                        position={cityData.coords}
                        city={cityData.city}
                        count={cityData.count}
                        reports={cityData.reports}
                    />
                ))}
            </MapContainer>

            {/* HUD Overlay Elements */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between pointer-events-none">
                <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-xs font-bold tracking-widest text-white uppercase">Live Surveillance</span>
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg pointer-events-auto">
                    <span className="text-xs font-bold text-amber-500">{totalIncidents} active signals</span>
                </div>
            </div>

            {/* Bottom Legend */}
            <div className="absolute bottom-6 left-6 pointer-events-none">
                <div className="bg-slate-900/80 backdrop-blur-md border border-white/5 p-3 rounded-xl flex flex-col gap-2 pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                        <span className="text-[10px] text-slate-300 font-medium">Critical (5+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                        <span className="text-[10px] text-slate-300 font-medium">Moderate (3-5)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                        <span className="text-[10px] text-slate-300 font-medium">Monitoring (1-2)</span>
                    </div>
                </div>
            </div>

            {/* Styles for Leaflet Popup (can be moved to global CSS) */}
            <style>{`
                .glass-popup .leaflet-popup-content-wrapper {
                    background: transparent;
                    box-shadow: none;
                    padding: 0;
                    border-radius: 0;
                }
                .glass-popup .leaflet-popup-tip {
                    background: #3b82f6; /* Default tip color, matches header bottom usually */
                    display: none; /* Hide tip for cleaner look */
                }
                @keyframes ping {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    )
}

export default IndiaMap
