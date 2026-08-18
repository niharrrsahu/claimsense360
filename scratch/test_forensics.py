import requests
import json
import io
from PIL import Image

payload = {
    'customer_name': 'Nihar Sahu',
    'vehicle_make_model': 'Hyundai Creta 1.5 SX',
    'age': 28,
    'vehicle_price': 1400000,
    'claim_amount': 95000,
    'vehicle_age': 3,
    'past_claims': 0,
    'driver_rating': 5,
    'policy_type': 'Comprehensive',
    'fault': 'Third Party',
    'accident_area': 'Urban',
    'police_report_filed': True,
    'witness_present': True,
    'incident_description': 'Front left bumper crushing and grill detachment.'
}

# Create a valid JPEG image in memory (simulating a downloaded Google photo without EXIF camera metadata)
img = Image.new('RGB', (400, 300), color='white')
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='JPEG')
image_bytes = img_byte_arr.getvalue()

files = {'image': ('downloaded_google_creta.jpg', image_bytes, 'image/jpeg')}

res = requests.post(
    'http://127.0.0.1:8000/claims/analyze',
    headers={'Authorization': 'Bearer cs_token'},
    data={'claim': json.dumps(payload)},
    files=files
)

print('API Status Code:', res.status_code)
data = res.json()
print('Risk Score:', data.get('overall_risk_score'))
print('Risk Band:', data.get('risk_band'))
print('Recommended Action:', data.get('recommended_action'))
print('Top SHAP Factors:', [f['name'] for f in data.get('top_factors', [])])
print('Damage Result:', json.dumps(data.get('damage'), indent=2))
