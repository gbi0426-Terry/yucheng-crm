from PIL import Image
import numpy as np

def check_image(path):
    try:
        img = Image.open(path)
        print(f"Image loaded: {path}")
        print(f"Format: {img.format}, Size: {img.size}, Mode: {img.mode}")
        
        # Check if it's all white or empty
        extrema = img.convert("L").getextrema()
        print(f"Extrema (Min, Max): {extrema}")
        
        if extrema == (255, 255):
            print("Image is completely WHITE.")
        elif extrema == (0, 0):
            print("Image is completely BLACK.")
        else:
            print("Image has content.")
            
            # Sample center pixel
            center_pixel = img.getpixel((img.width // 2, img.height // 2))
            print(f"Center pixel: {center_pixel}")
            
    except Exception as e:
        print(f"Error: {e}")

check_image('yucheng_dashboard_v2.png')
check_image('yucheng_customers.png')
