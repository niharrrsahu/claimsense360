"""
Deception Detection NLP Narrative Data Generator
Generates synthetic narrative training examples based on deceptive vs genuine communication patterns
in insurance claims (hedging, urgency, vagueness, lack of details vs specific timestamps, calm tone, police report references).
"""

import random
import pandas as pd

GENUINE_TEMPLATES = [
    "I was driving home on {street} at around {time} when a {vehicle} suddenly {action} and hit my {part}. We exchanged insurance details and filed a police report at the local station.",
    "On {date} morning near {location}, I stopped at a red light and the car behind me failed to brake in time. Officer {officer} arrived and recorded the scene. Witness {witness} confirmed the event.",
    "My vehicle was parked outside {location} on {street}. I returned at {time} to find scratches and a dent on the driver side door. I called traffic police immediately.",
    "Cruising at 40 km/h on {street}, another driver emerged from a side alley without signaling. My front bumper collided with their rear side. No injuries reported.",
    "I hit a pothole on {street} during heavy rain at {time}. The front axle and tire were damaged. Called breakdown service immediately and documented photographs.",
]

SUSPICIOUS_TEMPLATES = [
    "I think I parked somewhere around {location} but I am not really sure about the exact time. Later I noticed huge damage everywhere. Need urgent claim payout immediately.",
    "Some unknown vehicle maybe hit my car somewhere on {street}. I didn't call police or take pictures because I was in a rush. Please process approval fast without delay.",
    "I believe someone bumped into my vehicle. I am not completely certain who was driving or when it happened, but the entire panel is destroyed. Fast cash transfer requested.",
    "Accident occurred late night. I think it was around midnight but cannot recall details. No witnesses were there. Extremely urgent compensation required today.",
    "Car was damaged mysteriously while I was away. I don't remember the street name or exact time. I just want full claim amount settled immediately.",
]

STREETS = ["MG Road", "Park Street", "Ring Road", "Outer Bypass", "Station Avenue", "Industrial Highway"]
LOCATIONS = ["the shopping mall", "office parking lot", "the metro station", "downtown market", "residential complex"]
VEHICLES = ["white SUV", "delivery truck", "motorcycle", "sedan", "heavy lorry"]
ACTIONS = ["swerved into my lane", "braked abruptly", "took a sharp turn", "ignored the stop sign"]
PARTS = ["front bumper", "side fender", "rear door", "headlight assembly", "tailgate"]
OFFICERS = ["Sharma", "Verma", "Patel", "Singh", "Deshmukh"]
WITNESSES = ["Ramesh", "Anand", "Priya", "Sunil", "Kavita"]
TIMES = ["8:15 AM", "2:30 PM", "6:45 PM", "10:20 AM", "5:00 PM"]
DATES = ["Monday", "last Friday", "12th August", "yesterday", "weekend"]

def generate_synthetic_narratives(n_samples_per_class: int = 700, seed: int = 42) -> pd.DataFrame:
    random.seed(seed)
    data = []
    
    for _ in range(n_samples_per_class):
        tpl = random.choice(GENUINE_TEMPLATES)
        text = tpl.format(
            street=random.choice(STREETS),
            time=random.choice(TIMES),
            vehicle=random.choice(VEHICLES),
            action=random.choice(ACTIONS),
            part=random.choice(PARTS),
            location=random.choice(LOCATIONS),
            date=random.choice(DATES),
            officer=random.choice(OFFICERS),
            witness=random.choice(WITNESSES)
        )
        data.append({"text": text, "label": 0})  # 0 = genuine
        
    for _ in range(n_samples_per_class):
        tpl = random.choice(SUSPICIOUS_TEMPLATES)
        text = tpl.format(
            street=random.choice(STREETS),
            location=random.choice(LOCATIONS)
        )
        data.append({"text": text, "label": 1})  # 1 = suspicious
        
    random.shuffle(data)
    return pd.DataFrame(data)

if __name__ == "__main__":
    df = generate_synthetic_narratives()
    print(f"Generated {len(df)} narrative samples. Suspicious ratio: {df['label'].mean():.2%}")
