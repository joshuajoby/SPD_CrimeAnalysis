# news_logic.py
# Member 2 – Backend Logic
# Purpose: Extract meaningful information from news text using both heuristics and extensive AI models
import os
import json
import re

try:
    import google.generativeai as genai
    from dotenv import load_dotenv
    load_dotenv()
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))
    gemini_model = genai.GenerativeModel('gemini-2.5-flash')
except ImportError:
    gemini_model = None
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
    
    # Base heuristic analysis (Fast)
    crime_type = detect_crime_type(text)
    location = detect_location(text)
    sensational_count = count_sensational_words(text)
    fallback_cred = calculate_credibility(source, sensational_count)
    
    result = {
        "crime_type": crime_type,
        "location": location,
        "sensational_count": sensational_count,
        "credibility": fallback_cred,
        "justification": "Analyzed using baseline keyword heuristics. Please add GEMINI_API_KEY in .env for extensive AI analysis.",
        "fact_check": "Insufficient data for detailed fact check.",
        "sentiment": "Neutral"
    }
    
    # Extensive AI Analysis (Accurate & Deep)
    api_key = os.environ.get("GEMINI_API_KEY")
    if gemini_model and api_key and api_key != "YOUR_API_KEY_HERE":
        prompt = f"""
        You are an elite, objective intelligence analyst.
        Analyze the following news report for credibility, factuality, and bias.
        
        Source Publisher: {source}
        Article Title: {title}
        Article Content Snippet: {description}
        
        Respond ONLY with a valid JSON object containing exactly these keys:
        - "credibility": String, strictly one of ["High", "Medium", "Low"]. Rely heavily on the reputation of the Source Publisher and the presence of sensationalism.
        - "justification": String, detailed transparent reasoning for the credibility score. Mention source reputation, sensational language, and potential bias in 1-2 thoughtful sentences.
        - "fact_check": String, a brief fact-checking note describing if the claims seem verified or anecdotal.
        - "sentiment": String, strictly one of ["Positive", "Neutral", "Negative"].
        """
        try:
            response = gemini_model.generate_content(prompt)
            match = re.search(r'\{.*\}', response.text, re.DOTALL)
            if match:
                ai_data = json.loads(match.group(0))
                cred = ai_data.get("credibility", "")
                if cred in ["High", "Medium", "Low"]:
                    result["credibility"] = cred
                result["justification"] = ai_data.get("justification", result["justification"])
                result["fact_check"] = ai_data.get("fact_check", result["fact_check"])
                result["sentiment"] = ai_data.get("sentiment", result["sentiment"])
        except Exception as e:
            print(f"[AI Analysis Warning] Failed to reach Gemini: {e}")
            
    return result
