
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Phone, Ambulance, Flame, ShieldAlert, HeartPulse } from 'lucide-react'

const emergencyContacts = [
    {
        category: "Police",
        number: "100",
        icon: ShieldAlert,
        color: "text-blue-600",
        bg: "bg-blue-100",
        desc: "Immediate police assistance for crimes and emergencies."
    },
    {
        category: "Ambulance",
        number: "102",
        icon: Ambulance,
        color: "text-red-600",
        bg: "bg-red-100",
        desc: "Medical emergencies and accident response."
    },
    {
        category: "Fire Brigade",
        number: "101",
        icon: Flame,
        color: "text-orange-600",
        bg: "bg-orange-100",
        desc: "Fire outbreaks and rescue operations."
    },
    {
        category: "Women Helpline",
        number: "1091",
        icon: HeartPulse,
        color: "text-purple-600",
        bg: "bg-purple-100",
        desc: "24/7 support and safety for women in distress."
    },
    {
        category: "Cyber Crime",
        number: "1930",
        icon: ShieldAlert,
        color: "text-cyan-600",
        bg: "bg-cyan-100",
        desc: "Reporting financial fraud and cyber harassment."
    },
    {
        category: "Disaster Management",
        number: "108",
        icon: Activity,
        color: "text-green-600",
        bg: "bg-green-100",
        desc: "Natural disasters and centralized emergency response."
    }
]

import { Activity } from 'lucide-react'

function EmergencyContacts() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow pt-24 px-4 pb-12 w-full max-w-[95%] mx-auto">
                <div className="w-full">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4 text-red-600">Emergency Contacts</h1>
                        <p className="text-xl text-muted-foreground">
                            Immediate assistance numbers for various emergencies.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {emergencyContacts.map((contact, index) => {
                            const Icon = contact.icon
                            return (
                                <Card key={index} className="hover:shadow-lg transition-shadow border-t-4" style={{ borderColor: contact.category === 'Police' ? '#2563eb' : contact.category === 'Ambulance' ? '#dc2626' : '#f97316' }}>
                                    <CardHeader className="pb-2">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${contact.bg}`}>
                                            <Icon className={`w-6 h-6 ${contact.color}`} />
                                        </div>
                                        <CardTitle className="text-xl">{contact.category}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm mb-6 min-h-[40px]">
                                            {contact.desc}
                                        </p>
                                        <Button className="w-full text-lg font-bold" size="lg" asChild>
                                            <a href={`tel:${contact.number}`}>
                                                <Phone className="mr-2 h-5 w-5" /> Call {contact.number}
                                            </a>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    <div className="mt-12 p-6 bg-muted/50 rounded-lg text-center">
                        <p className="text-muted-foreground">
                            <strong>Note:</strong> These numbers are for India. If you are in another country, please dial your local emergency number (e.g., 911 for USA/Canada, 112 for Europe).
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default EmergencyContacts
