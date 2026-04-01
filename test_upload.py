import requests
import time

filepath = r"c:\Users\Maamoun\Downloads\antygravity\easy tool 1\06 - سياسة تعارض المصالح.pdf"
url = "https://filemind-backend-api-production-b423.up.railway.app/api/tools/upload"

print(f"Uploading {filepath}...")

with open(filepath, 'rb') as f:
    files = {'file': ('test.pdf', f, 'application/pdf')}
    data = {'toolType': 'pdf-to-word'}
    response = requests.post(url, files=files, data=data)

if response.status_code != 200:
    print(f"Upload failed: {response.text}")
    exit(1)

job_id = response.json().get('job_id')
print(f"Upload successful. Job ID: {job_id}")

status_url = f"https://filemind-backend-api-production-b423.up.railway.app/api/tools/status/{job_id}"

while True:
    res = requests.get(status_url)
    if res.status_code != 200:
        print(f"Error checking status: {res.text}")
        break
    
    status_data = res.json()
    status = status_data.get('status')
    print(f"Status: {status}")
    
    if status in ['COMPLETED', 'FAILED']:
        break
    
    time.sleep(2)
