import fitz
input_path = r'c:\Users\Maamoun\Downloads\antygravity\easy tool 1\06 - سياسة تعارض المصالح.pdf'
doc = fitz.open(input_path)
for i in range(min(5, len(doc))):
    page = doc[i]
    images = page.get_image_info()
    text = page.get_text().strip()
    print(f'Page {i}: text length = {len(text)}')
    if images:
        for img in images:
            box = img['bbox']
            width = box[2] - box[0]
            height = box[3] - box[1]
            area = width * height
            page_area = page.rect.width * page.rect.height
            ratio = area / page_area
            print(f'  Image ratio: {ratio:.2f}')
