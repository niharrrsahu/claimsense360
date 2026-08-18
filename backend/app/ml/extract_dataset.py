import os
import zipfile

def extract_yolo_dataset():
    zip_path = r"C:\Users\NIHAR\Downloads\Car Damage Detection.v1i.yolov8.zip"
    target_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/yolo_dataset"))
    os.makedirs(target_dir, exist_ok=True)
    
    print(f"Opening Roboflow dataset zip: {zip_path}")
    print(f"Target directory: {target_dir}")
    
    with zipfile.ZipFile(zip_path, "r") as z:
        members = z.infolist()
        total = len(members)
        print(f"Total entries in dataset: {total}")
        
        for idx, member in enumerate(members):
            if member.is_dir():
                continue
            # Trim filename if too long for Windows path limit
            filename = member.filename
            parts = filename.split("/")
            if len(parts) > 1:
                subfolder = os.path.join(target_dir, *parts[:-1])
                os.makedirs(subfolder, exist_ok=True)
                fname = parts[-1]
                if len(fname) > 80:
                    ext = os.path.splitext(fname)[1]
                    fname = fname[:70] + ext
                dest_path = os.path.join(subfolder, fname)
            else:
                dest_path = os.path.join(target_dir, filename)
                
            try:
                with z.open(member) as source, open(dest_path, "wb") as target:
                    target.write(source.read())
            except Exception as e:
                pass

    print("YOLOv8 Dataset successfully extracted!")
    print(f"Contents in {target_dir}: {os.listdir(target_dir)}")

if __name__ == "__main__":
    extract_yolo_dataset()
