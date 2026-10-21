const DATA_URL = "data/items.json";
const IMAGE_DIR = "assets/images/";

const euro = value => new Intl.NumberFormat("ca-ES", {
  style: "currency", currency: "EUR", maximumFractionDigits: 2
}).format(value);

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

async function loadItems() {
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error("No s'ha pogut carregar data/items.json");
  return response.json();
}

function renderCard(item) {
  return `<article class="item-card">
    <a class="card-image-link" href="item.html?id=${encodeURIComponent(item.id)}" aria-label="Veure ${safe(item.name)}">
      <img class="card-image" src="${IMAGE_DIR + encodeURIComponent(item.mainImage)}" alt="${safe(item.name)}" loading="lazy">
      <span class="category-tag">${safe(item.category)}</span>
    </a>
    <div class="card-content">
      <div class="card-heading"><h2><a href="item.html?id=${encodeURIComponent(item.id)}">${safe(item.name)}</a></h2><p class="price">${euro(item.price)}</p></div>
      <p class="store">${safe(item.store || "Botiga no indicada")}</p>
      <a class="text-link" href="item.html?id=${encodeURIComponent(item.id)}">Veure detalls <span aria-hidden="true">→</span></a>
    </div>
  </article>`;
}

async function initIndex() {
  const grid = document.querySelector("#items-grid");
  if (!grid) return;
  const count = document.querySelector("#results-count");
  const filters = document.querySelector("#category-filters");
  const search = document.querySelector("#search");
  const empty = document.querySelector("#empty-state");
  try {
    const items = await loadItems();
    const categories = ["Totes", ...new Set(items.map(item => item.category))];
    let activeCategory = "Totes";

    filters.innerHTML = categories.map(category =>
      `<button type="button" class="filter-button${category === activeCategory ? " active" : ""}" data-category="${safe(category)}">${safe(category)}</button>`
    ).join("");

    filters.addEventListener("click", event => {
      const button = event.target.closest("button[data-category]");
      if (!button) return;
      activeCategory = button.dataset.category;
      filters.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === button));
      render();
    });
    search.addEventListener("input", render);

    function render() {
      const query = search.value.trim().toLocaleLowerCase("ca");
      const visible = items.filter(item =>
        (activeCategory === "Totes" || item.category === activeCategory) &&
        `${item.name} ${item.category} ${item.store || ""}`.toLocaleLowerCase("ca").includes(query)
      );
      grid.innerHTML = visible.map(renderCard).join("");
      count.textContent = `${visible.length} ${visible.length === 1 ? "element" : "elements"}`;
      empty.hidden = visible.length !== 0;
    }
    render();
  } catch (error) {
    grid.innerHTML = `<p class="error">${safe(error.message)}. Obre el web mitjançant GitHub Pages o un servidor local, no directament com a fitxer.</p>`;
    count.textContent = "Error";
  }
}

async function initDetail() {
  const target = document.querySelector("#item-detail");
  if (!target) return;
  const id = new URLSearchParams(location.search).get("id");
  try {
    const items = await loadItems();
    const item = items.find(entry => entry.id === id);
    if (!item) {
      target.innerHTML = `<div class="not-found"><h1>Element no trobat</h1><p class="muted">Potser s'ha eliminat o l'enllaç no és correcte.</p></div>`;
      return;
    }
    const gallery = (item.images?.length ? item.images : [item.mainImage]).map((image, index) =>
      `<img class="gallery-image${image === item.mainImage ? " main-photo" : ""}" src="${IMAGE_DIR + encodeURIComponent(image)}" alt="${safe(item.name)}${index ? " — fotografia " + (index + 1) : ""}" loading="lazy">`
    ).join("");
    const rows = Object.entries(item.characteristics || {}).map(([key, value]) =>
      `<div class="spec-row"><dt>${safe(key)}</dt><dd>${safe(value)}</dd></div>`
    ).join("");
    target.innerHTML = `<div class="detail-grid">
      <div class="detail-gallery">${gallery || `<div class="image-placeholder">Sense fotografies</div>`}</div>
      <div class="detail-info">
        <p class="eyebrow">${safe(item.category)}</p>
        <h1>${safe(item.name)}</h1>
        <p class="detail-price">${euro(item.price)}</p>
        <p class="muted">${safe(item.store || "Botiga no indicada")}</p>
        <p class="description">${safe(item.description || "")}</p>
        <dl class="spec-list">${rows}</dl>
        ${item.url ? `<a class="primary-link" href="${safe(item.url)}" target="_blank" rel="noopener noreferrer">Obrir a la botiga ↗</a>` : ""}
      </div>
    </div>`;
    document.title = `${item.name} — Casa`;
  } catch (error) {
    target.innerHTML = `<p class="error">${safe(error.message)}</p>`;
  }
}

initIndex();
initDetail();
