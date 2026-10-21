import os
import json
import base64

payload = json.loads(os.environ.get('EVENT_PAYLOAD', '{}'))

if not payload:
    exit(0)

# Dades rebudes del formulari
id = payload.get('id')
name = payload.get('name')
category = payload.get('category')
price = payload.get('price')
store = payload.get('store')
url = payload.get('url')
main_image_data = payload.get('mainImage') # { name: "...", data: "base64..." }
other_images = payload.get('otherImages', []) # Llista de { name: "...", data: "base64..." }
description = payload.get('description')
characteristics = payload.get('characteristics', [])

images_dir = 'assets/images'
os.makedirs(images_dir, exist_ok=True)

# Guardar imatge principal
main_image_name = ""
if main_image_data:
    main_image_name = main_image_data['name']
    img_path = os.path.join(images_dir, main_image_name)
    with open(img_path, 'wb') as fh:
        fh.write(base64.b64decode(main_image_data['data'].split(',')[1]))

# Guardar altres imatges
saved_other_images = []
for img in other_images:
    img_name = img['name']
    img_path = os.path.join(images_dir, img_name)
    with open(img_path, 'wb') as fh:
        fh.write(base64.b64decode(img['data'].split(',')[1]))
    saved_other_images.append(img_name)

# Carregar data/items.json actual
json_path = 'data/items.json'
with open(json_path, 'r', encoding='utf-8') as f:
    items = json.load(f)

# Generar un nou ID basat en l'últim o en un comptador
new_id = max([item.get('id', 0) for item in items], default=0) + 1

# Crear el nou element
new_item = {
    "id": new_id,
    "name": name,
    "category": category,
    "price": price,
    "currency": "EUR",
    "store": store,
    "url": url,
    "mainImage": f"assets/images/{main_image_name}" if main_image_name else "",
    "otherImages": [f"assets/images/{img}" for img in saved_other_images],
    "description": description,
    "characteristics": characteristics
}

items.append(new_item)

# Guardar de nou el fitxer JSON
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(items, f, indent=4, ensure_ascii=False)

print("Element afegit correctament al JSON i imatges desades.")