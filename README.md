# Casa — inventari personal

Una web estàtica per guardar els mobles i objectes que estàs valorant comprar. Funciona amb GitHub Pages: no necessita servidor, base de dades ni compilació.

## Què inclou

- Targetes amb fotografia principal, nom, categoria, botiga i preu.
- Filtres per categoria i cerca per nom/botiga.
- Una pàgina de detall per element, amb característiques, galeria i enllaç a la botiga.
- Dades en `data/items.json` i fotografies a `assets/images/`.
- Dades d'exemple i imatges SVG perquè es vegi bé immediatament.

## Publicar a GitHub Pages

1. Crea un repositori a GitHub, per exemple `casa`.
2. Puja-hi tots els fitxers i carpetes d'aquest projecte (no només `index.html`).
3. A **Settings → Pages**, a **Build and deployment**, selecciona **Deploy from a branch**.
4. Tria la branca `main` i la carpeta `/ (root)`, i desa.
5. Al cap d'un moment, GitHub et donarà l'adreça pública de la web.

## Afegir o editar elements

Edita `data/items.json`. Cada element és un objecte amb aquesta estructura:

```json
{
  "id": "sofa-verd",
  "name": "Sofà verd",
  "category": "Sofàs",
  "price": 850,
  "currency": "EUR",
  "store": "Nom de la botiga",
  "url": "https://exemple.cat/producte",
  "mainImage": "sofa-verd.jpg",
  "images": ["sofa-verd.jpg", "sofa-verd-detall.jpg"],
  "description": "Descripció breu.",
  "characteristics": {
    "Color": "Verd",
    "Amplada": "210 cm",
    "Material": "Teixit"
  }
}
```

- `id`: identificador únic, curt i sense espais. S'utilitza a l'adreça de la pàgina de detall.
- `category`: el nom que apareixerà als filtres. Mantén el mateix text per a elements de la mateixa categoria.
- `price`: preu numèric, sense símbol d'euro.
- `mainImage`: nom exacte del fitxer que vols destacar a la targeta.
- `images`: llista de noms de fitxer per a la galeria. Desa les imatges dins `assets/images/`.
- `characteristics`: pots afegir o treure camps lliurement.

**Important:** el fitxer JSON ha de tenir comes correctes i les cadenes entre cometes dobles. No deixis una coma després de l'últim camp d'un objecte.

## Recomanacions per a les fotos

Redimensiona les fotos a una amplada aproximada de 1000–1400 px abans de pujar-les; així la web carregarà ràpid. Utilitza noms senzills, per exemple `sofa-verd.jpg`, sense accents ni espais.

## Provar-ho al teu ordinador

Com que la web carrega el JSON amb `fetch`, no obris `index.html` fent doble clic. Des de la carpeta del projecte executa:

```bash
python3 -m http.server 8000
```

I visita `http://localhost:8000`.

## Limitació d'aquesta versió mínima

La web és de lectura: per afegir o modificar elements, edita `data/items.json` i puja les imatges al repositori. No hi ha formulari d'administració ni base de dades al servidor. Qualsevol canvi al repositori pot quedar públic si el repositori és públic; si vols mantenir l'inventari privat, revisa les opcions de visibilitat i disponibilitat de GitHub Pages del teu compte.
