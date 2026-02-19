# news_logic.py
# Member 2 – Backend Logic
# Purpose: Extract meaningful information from news text

CRIME_KEYWORDS = {
    "theft": ["theft", "robbery", "stolen", "burglary", "snatching", "looted", "thief"],
    "fraud": ["fraud", "scam", "cheated", "laundering", "extortion", "embezzlement", "cybercrime", "phishing", "fake"],
    "murder": ["murder", "killed", "kills", "killing", "dead", "death", "homicide", "assassination", "slain", "lynched", "body found", "shootout"],
    "assault": ["assault", "attacked", "beaten", "injured", "stabbed", "shot", "violence", "clash", "thrashed", "brawl"],
    "rape": ["rape", "molested", "harassment", "abuse", "trafficking", "sex crime", "gangrape"],
    "drugs": ["drugs", "smuggling", "narcotics", "cocaine", "heroin", "ganja", "seized", "contraband", "weed"],
    "kidnapping": ["kidnapped", "abducted", "missing", "kidnap"]
}

# Strict mapping for common variations to standard city names
CITY_MAPPINGS = {
    "delhi": "Delhi", "new delhi": "Delhi", "ncr": "Delhi",
    "bombay": "Mumbai", "mumbai": "Mumbai",
    "madras": "Chennai", "chennai": "Chennai",
    "calcutta": "Kolkata", "kolkata": "Kolkata",
    "bangalore": "Bengaluru", "bengaluru": "Bengaluru",
    "gurgaon": "Gurugram", "gurugram": "Gurugram",
}

LOCATIONS = [
    "Delhi", "Mumbai", "Chennai", "Kolkata", "Bengaluru", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Surat",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad",
    "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad",
    "Amritsar", "Navi Mumbai", "Allahabad", "Prayagraj", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior",
    "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli", "Dharwad",
    "Mysore", "Tiruchirappalli", "Gurgaon", "Gurugram", "Noida", "Dehradun", "Shimla", "Panaji", "Bhubaneswar",
    "Kerala", "Goa", "Punjab", "Haryana", "Uttar Pradesh", "Bihar", "West Bengal", "Maharashtra", "Karnataka",
    "Tamil Nadu", "Telangana", "Andhra Pradesh", "Gujarat", "Rajasthan", "Madhya Pradesh", "Odisha", "Assam"
]

def detect_crime_type(text):
    text = text.lower()
    for crime, words in CRIME_KEYWORDS.items():
        for word in words:
            # Check for word as a distinct word or part of a larger word
            if word in text: 
                return crime
    return "general" # Fallback instead of unknown

def detect_location(text):
    text = text.lower()
    
    # 1. Check strict mappings first
    for variation, standard in CITY_MAPPINGS.items():
        if variation in text:
            return standard
            
    # 2. Check general list
    for place in LOCATIONS:
        if place.lower() in text:
            return place # Return standardized capitalization from list matches
            
    return "India" # Fallback to country level to show on map

SENSATIONAL_WORDS = [
    "shocking", "horrifying", "brutal", "chilling", "terrifying", "panic", "bloodcurdling", "ghastly", "macabre"
]

TRUSTED_SOURCES = [
    "The Hindu", "Times of India", "Hindustan Times", "Indian Express", "NDTV", "India Today", "BBC News",
    "DD News", "All India Radio", "Business Standard", "Livemint", "The Wire", "Scroll.in", "News18",
    "Firstpost", "Deccan Chronicle", "The Tribune", "Outlook India"
]

def count_sensational_words(text):
    text = text.lower()
    count = 0
    for word in SENSATIONAL_WORDS:
        if word in text:
            count += 1
    return count

def calculate_credibility(source, sensational_count):
    score = 0
    
    # 1. Source Trust (Base Score)
    source_lower = source.lower()
    is_trusted = any(trusted.lower() in source_lower for trusted in TRUSTED_SOURCES)
    
    if is_trusted:
        score = 80  # High base score for known sources
    elif "google" in source_lower:
        score = 60  # Medium for aggregator
    else:
        score = 50  # Neutral starting point for unknown

    # 2. Sensationalism Penalty
    penalty = sensational_count * 5
    score -= penalty

    # 3. Cap and Label
    score = max(0, min(100, score))
    
    if score >= 75:
        return "High"
    elif score >= 50:
        return "Medium"
    else:
        return "Low"

def analyze_news(title, description, source="Unknown"):
    text = f"{title} {description}"
    sensational_count = count_sensational_words(text)
    
    return {
        "crime_type": detect_crime_type(text),
        "location": detect_location(text),
        "sensational_count": sensational_count,
        "credibility": calculate_credibility(source, sensational_count)
    }
