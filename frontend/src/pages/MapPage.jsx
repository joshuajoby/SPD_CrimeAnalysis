
import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Card } from '../components/ui/card'
import L from 'leaflet'

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const mockCrimeData = [
    { id: 1, lat: 28.6139, lng: 77.2090, type: 'Theft', location: 'New Delhi', desc: 'Pickpocketing reported near metro station.' },
    { id: 2, lat: 19.0760, lng: 72.8777, type: 'Fraud', location: 'Mumbai', desc: 'Online banking scam reported.' },
    { id: 3, lat: 12.9716, lng: 77.5946, type: 'Traffic', location: 'Bangalore', desc: 'Major congestion due to accident.' },
    { id: 4, lat: 13.0827, lng: 80.2707, type: 'Assault', location: 'Chennai', desc: 'Altercation in local market.' },
    { id: 5, lat: 22.5726, lng: 88.3639, type: 'Vandalism', location: 'Kolkata', desc: 'Public property damage reported.' },
]

function MapPage() {
    const [activeCrime, setActiveCrime] = useState(null)

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow pt-28 w-full relative z-10 h-[calc(100vh)]">
                <MapContainer
                    center={[20.5937, 78.9629]}
                    zoom={5}
                    scrollWheelZoom={true}
                    className="w-full h-full"
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {mockCrimeData.map(crime => (
                        <Marker
                            key={crime.id}
                            position={[crime.lat, crime.lng]}
                            eventHandlers={{
                                click: () => {
                                    setActiveCrime(crime)
                                },
                            }}
                        >
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-bold text-base mb-1">{crime.location}</h3>
                                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded mb-2 font-semibold">
                                        {crime.type}
                                    </span>
                                    <p className="text-sm text-gray-600">{crime.desc}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Floating Info Card */}
                <div className="absolute top-24 left-4 z-[1000] w-80">
                    <Card className="bg-white/90 backdrop-blur shadow-xl">
                        <div className="p-4">
                            <h2 className="font-bold text-lg mb-2">Live Crime Heatmap</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Visualizing recent incidents across major cities. Click markers for details.
                            </p>
                            <div className="flex gap-2 text-xs">
                                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Low Risk</div>
                                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Moderate</div>
                                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span> High Risk</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>

            {/* Note: Map usually takes full screen, so footer might be optional or sticky at bottom if needed. 
          For now, we leave it out of the visible area to maximize map space, or can add it if scrolling.
      */}
        </div>
    )
}

export default MapPage
