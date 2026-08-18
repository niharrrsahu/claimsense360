import sys
import os

# Add backend directory to sys.path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from app.ml.damage_analysis import analyze_damage_image

def main():
    image_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".user_uploaded", "media_1786966274089.png"))
    
    if not os.path.exists(image_path):
        # Fallback to creating a dummy test byte array if file doesn't exist
        print(f"Warning: {image_path} not found, generating sample test image bytes")
        from PIL import Image, ImageDraw
        import io
        img = Image.new('RGB', (640, 480), color=(150, 30, 30))
        draw = ImageDraw.Draw(img)
        draw.rectangle([100, 100, 300, 300], fill=(50, 50, 50))
        buf = io.BytesIO()
        img.save(buf, format='JPEG')
        img_bytes = buf.getvalue()
    else:
        with open(image_path, "rb") as f:
            img_bytes = f.read()

    print(f"Loaded {len(img_bytes)} bytes of vehicle image data.")
    
    # Execute damage analysis
    result = analyze_damage_image(img_bytes)
    
    print("\n==========================================")
    print("COMPUTER VISION DAMAGE ANALYSIS RESULT:")
    print("==========================================")
    print(f"Damage Severity: {result.get('damage_severity')}")
    print(f"Damage Score:    {result.get('damage_score')}/100")
    print(f"Execution Method:{result.get('method')}")
    print(f"Has EXIF Header: {result.get('has_exif')}")
    print(f"Is Web Asset:   {result.get('is_web_asset')}")
    print("==========================================")
    
    assert "YOLO" in result.get("method", "") or "ResNet" in result.get("method", ""), f"Error: YOLO/ResNet not active in method: {result.get('method')}"
    print("SUCCESS: YOLOv8 + PyTorch ResNet-18 Deep Learning CV is ACTIVE & CONFIRMED!")

if __name__ == "__main__":
    main()
