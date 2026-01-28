TRUSTED_SOURCES = [
    "The Hindu", "Indian Express", "BBC",
    "Reuters", "NDTV", "Times of India"
]

SENSATIONAL_WORDS = [
    "shocking", "horrifying", "brutal",
    "chilling", "unbelievable"
]

def calculate_credibility(article):
    score = 0
    text = (article["title"] + " " + article.get("description", "")).lower()

    # Trusted source
    if article["source"] in TRUSTED_SOURCES:
        score += 3

    # Police / official mention
    if "police" in text or "official" in text:
        score += 2

    # Clear location
    if article.get("location") != "Unknown":
        score += 2

    # Sensational language
    for word in SENSATIONAL_WORDS:
        if word in text:
            score -= 2

    # Final label
    if score >= 5:
        return "High"
    elif score >= 2:
        return "Medium"
    else:
        return "Low"
