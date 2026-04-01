import requests, os

job_id = 'aeca02d5-0bfb-476f-93da-a2c0deb9a0da'
download_url = f'https://filemind-backend-api-production-b423.up.railway.app/api/tools/download/{job_id}'

res = requests.get(download_url)
with open('test_output.docx', 'wb') as f:
    f.write(res.content)
print(f'Downloaded {len(res.content)} bytes to test_output.docx')
