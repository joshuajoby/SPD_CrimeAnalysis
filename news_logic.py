# news_logic.py
# Member 2 – Backend Logic
# Purpose: Extract meaningful information from news text

CRIME_KEYWORDS = {
    "theft": ["theft", "robbery", "stolen"],
    "fraud": ["fraud", "scam", "cheated"],
    "murder": ["murder", "killed", "dead"]
}

def detect_crime_type(text):
    text = text.lower()
    for crime, words in CRIME_KEYWORDS.items():
        for word in words:
            if word in text:
                return crime
    return "unknown"


LOCATIONS = [
    "delhi",
    "mumbai",
    "chennai",
    "kerala",
    "bengaluru",
    "hyderabad"
]

def detect_location(text):
    text = text.lower()
    for place in LOCATIONS:
        if place in text:
            return place.title()
    return "Unknown"


SENSATIONAL_WORDS = [
    "shocking",
    "horrifying",
    "brutal",
    "chilling",
    "terrifying",
    "panic"
]

def count_sensational_words(text):
    text = text.lower()
    count = 0
    for word in SENSATIONAL_WORDS:
        if word in text:
            count += 1
    return count


def analyze_news(title, description):
    text = f"{title} {description}"
    return {
        "crime_type": detect_crime_type(text),
        "location": detect_location(text),
        "sensational_count": count_sensational_words(text)
    }
