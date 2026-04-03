import requests
import time
import os

filepath = r"c:\Users\Maamoun\Downloads\antygravity\easy tool 1\06 - سياسة تعارض المصالح.pdf"
url = "https://filemind-backend-api-production-b423.up.railway.app/api/tools/upload"

if not os.path.exists(filepath):
    print(f"Error: File not found at {filepath}")
    exit(1)

print(f"Testing PROFESSIONAL OCR mode for: {os.path.basename(filepath)}")
print(f"Targeting: {url} with toolType='ocr-pdf-to-word'...")

with open(filepath, 'rb') as f:
    files = {'file': (os.path.basename(filepath), f, 'application/pdf')}
    data = {'toolType': 'ocr-pdf-to-word'}
    response = requests.post(url, files=files, data=data)

if response.status_code != 202: # 202 is the status_code in tools.py for Accepted
    if response.status_code == 200:
        pass
    else:
        print(f"Upload failed (Status {response.status_code}): {response.text}")
        exit(1)

job_id = response.json().get('job_id') or response.json().get('jobId')
print(f"Upload successful. Job ID: {job_id}")

status_url = f"https://filemind-backend-api-production-b423.up.railway.app/api/tools/status/{job_id}"

print("Processing starting. This may take 30-60 seconds for 16 pages of OCR...")

start_time = time.time()
while len(range(120)): # Max 4 minutes
    try:
        res = requests.get(status_url)
        if res.status_code != 200:
            print(f"Error checking status: {res.text}")
            break
        
        status_data = res.json()
        status = status_data.get('status').upper()
        elapsed = int(time.time() - start_time)
        print(f"[{elapsed}s] Current Status: {status}")
        
        if status == 'COMPLETED':
            print("SUCCESS: OCR Conversion complete!")
            break
        elif status == 'FAILED':
            print(f"FAILED: Job failed processing. Error: {status_data.get('error')}")
            break
    except Exception as e:
        print(f"Status check error: {e}")
    
    time.sleep(5)
