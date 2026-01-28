CRIME_KEYWORDS = {
    "Theft": ["theft", "stolen", "snatching", "robbery"],
    "Fraud": ["fraud", "scam", "cheating", "cyber"],
    "Murder": ["murder", "killed", "homicide"],
    "Assault": ["assault", "attack", "violence", "rape"]
}

CITIES = [
    "bengaluru", "delhi", "mumbai", "chennai",
    "hyderabad", "kolkata", "pune"
]

def detect_crime_type(text):
    text = text.lower()
    for crime, words in CRIME_KEYWORDS.items():
        for word in words:
            if word in text:
                return crime
    return "Other"

def detect_location(text):
    text = text.lower()
    for city in CITIES:
        if city in text:
            return city.title()
    return "Unknown"
