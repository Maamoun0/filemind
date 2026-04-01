import fitz

input_path = r'c:\Users\Maamoun\Downloads\antygravity\easy tool 1\06 - سياسة تعارض المصالح.pdf'
doc = fitz.open(input_path)
empty_pages = 0
num_pages = len(doc)
print(f'Total pages: {num_pages}')
for i in range(min(num_pages, 5)):
    page = doc[i]
    text = page.get_text().strip()
    print(f'Page {i} char count: {len(text)}')
    if len(text) < 100:
        empty_pages += 1
        
print(f'Empty pages (first 5): {empty_pages}')
if num_pages > 0 and (empty_pages / min(num_pages, 5)) >= 0.5:
    print('DETECTED AS SCANNED -> OCR PATH')
else:
    print('DETECTED AS NORMAL -> PDF2DOCX PATH')
