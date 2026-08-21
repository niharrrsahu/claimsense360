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
    "While reversing out of a parking spot near {location}, my {part} scraped against a concrete pillar. I reported it to the mall security and my insurer the same evening.",
    "A {vehicle} rear-ended me while I was stationary at a signal on {street} around {time}. Both drivers exchanged license and insurance details on the spot.",
    "During {date}, a tree branch fell on my car parked near {location} after heavy winds. I have timestamped photos and a report from the housing society watchman.",
    "I was involved in a minor collision with a {vehicle} at the {street} junction. We agreed it was a 60/40 fault split and both filed claims with our respective insurers.",
    "My car slid on a wet patch of {street} at {time} and grazed the roadside barrier. I informed the highway patrol and got a reference number for the incident.",
    "On {date}, while parked at {location}, my side mirror was clipped by a passing {vehicle}. The other driver stopped, and witness {witness} saw the whole thing.",
    "I was stationary in traffic on {street} when a {vehicle} behind me nudged forward and dented my {part}. Officer {officer} was called and documented the scene at {time}.",
]

SUSPICIOUS_TEMPLATES = [
    "I think I parked somewhere around {location} but I am not really sure about the exact time. Later I noticed huge damage everywhere. Need urgent claim payout immediately.",
    "Some unknown vehicle maybe hit my car somewhere on {street}. I didn't call police or take pictures because I was in a rush. Please process approval fast without delay.",
    "I believe someone bumped into my vehicle. I am not completely certain who was driving or when it happened, but the entire panel is destroyed. Fast cash transfer requested.",
    "Accident occurred late night. I think it was around midnight but cannot recall details. No witnesses were there. Extremely urgent compensation required today.",
    "Car was damaged mysteriously while I was away. I don't remember the street name or exact time. I just want full claim amount settled immediately.",
    "It's a bit hazy honestly, maybe near {location}, maybe somewhere else, but the whole front is smashed and I really need this settled before the weekend if at all possible.",
    "Someone must have hit my car, I can't say who or when exactly. There were no witnesses I could find and I didn't think to call anyone at the time, it just happened.",
    "The damage appeared after I left my car unattended for a while near {street}. I can't confirm the details but the repair estimate is quite high and I'd appreciate a quick decision.",
    "I was not around when it happened so I don't have first-hand details, but the vehicle came back with heavy damage and I was hoping this could move quickly given my situation.",
    "Not fully sure of the sequence of events near {location}, it all happened fast, no one else really saw it, and I'd rather not involve the police over something this minor.",
    "The incident took place somewhere along {street}, I didn't get a good look at the other vehicle, and honestly I'd prefer to settle this without too many extra questions.",
    "I noticed the damage only after returning to {location}; can't pin down exactly when it occurred, but given the amount involved I was hoping for a faster resolution.",
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
