
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion'
import { Shield, Lock, AlertTriangle, HeartPulse, Scale } from 'lucide-react'

function Resources() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-grow pt-28 px-4 pb-12 w-full max-w-[95%] mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">Safety <span className="text-primary">Resources</span></h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Essential guides, legal rights, and safety protocols to help you stay informed and prepared.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-blue-500">
                        <CardHeader>
                            <CardTitle className="flex items-center text-2xl">
                                <AlertTriangle className="mr-3 h-8 w-8 text-blue-500" />
                                Emergency Protocols
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-lg font-medium">What to do during a Robbery?</AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground">
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li><strong>Stay Calm:</strong> Do not resist or make sudden movements.</li>
                                            <li><strong>Observe:</strong> Try to remember physical details of the perpetrator (height, clothes, scars).</li>
                                            <li><strong>Comply:</strong> Hand over valuables if threatened. Your life is worth more than property.</li>
                                            <li><strong>Call 100:</strong> Contact police immediately after it is safe.</li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-lg font-medium">Fire Safety Basics</AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground">
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li><strong>R.A.C.E:</strong> Rescue, Alarm, Contain, Extinguish/Evacuate.</li>
                                            <li><strong>Crawl Low:</strong> Smoke rises, so stay close to the floor.</li>
                                            <li><strong>Stop, Drop, Roll:</strong> If your clothes catch fire.</li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-purple-500">
                        <CardHeader>
                            <CardTitle className="flex items-center text-2xl">
                                <HeartPulse className="mr-3 h-8 w-8 text-purple-500" />
                                Women's Safety
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-lg font-medium">Zero FIR</AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground">
                                        A Zero FIR can be filed in any police station irrespective of the place of the incident. The police cannot refuse to register it.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-lg font-medium">Virtual Complaints</AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground">
                                        Women can file complaints via email or registered post if they cannot go to the police station.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-lg font-medium">No Arrests After Sunset</AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground">
                                        Women cannot be arrested after sunset and before sunrise, except in exceptional circumstances with a magistrate's order.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-green-500">
                        <CardHeader>
                            <CardTitle className="flex items-center text-2xl">
                                <Lock className="mr-3 h-8 w-8 text-green-500" />
                                Cyber Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-lg font-medium">Reporting Cyber Fraud</AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground">
                                        Dial <strong>1930</strong> immediately to report financial fraud. The "Golden Hour" is critical for freezing funds.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-lg font-medium">Social Media Safety</AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground">
                                        Enable Two-Factor Authentication (2FA). Do not accept requests from unknown profiles. Report harassment immediately.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-indigo-500">
                        <CardHeader>
                            <CardTitle className="flex items-center text-2xl">
                                <Scale className="mr-3 h-8 w-8 text-indigo-500" />
                                Legal Rights
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-lg font-medium">Right to Information (RTI)</AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground">
                                        Every citizen has the right to ask for information from public authorities to promote transparency.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-lg font-medium">Right to Legal Aid</AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground">
                                        If you cannot afford a lawyer, the state must provide you with free legal aid (Article 39A).
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Resources
