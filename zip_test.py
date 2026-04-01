import zipfile

with zipfile.ZipFile('test_output.docx', 'r') as zip_ref:
    files = zip_ref.namelist()
    images = [f for f in files if f.startswith('word/media/')]
    print(f'Total files in docx: {len(files)}')
    print(f'Number of images embedded: {len(images)}')
