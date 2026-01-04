import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSyihPKxSmuUJbedOV1ewY4jDawx82A7k",
  authDomain: "shop-image-stock.firebaseapp.com",
  databaseURL: "https://shop-image-stock-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shop-image-stock",
  storageBucket: "shop-image-stock.firebasestorage.app",
  messagingSenderId: "107558527883",
  appId: "1:107558527883:web:2de05fb836083be933058e",
  measurementId: "G-FLG563FFZY"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const DB_URLS = [
  'https://nikitmehta.com.np/database.json',
  'https://nikitmehta.com.np/database1.json',
  'https://nikitmehta.com.np/database2.json'
];
const CACHE_TTL_MS = 1 * 24 * 60 * 60 * 1000; // 1 day
const ITEMS_PER_PAGE = 9;
let currentPage = 1;
let filteredData = [];

function showLoading() {
  document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

async function fetchFirebaseData() {
  try {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No Firebase data available');
      return [];
    }
  } catch (error) {
    console.error('[Firebase Fetch] Error:', error);
    return [];
  }
}

async function fetchJSONData() {
  try {
    const promises = DB_URLS.map(url => 
      fetch(url).then(res => res.ok ? res.json() : []).catch(() => [])
    );
    const results = await Promise.all(promises);
    return results.flat();
  } catch (err) {
    console.error('[JSON Fetch] Error:', err);
    return [];
  }
}

async function fetchFreshData() {
  try {
    // Fetch both Firebase and JSON data
    const [firebaseData, jsonData] = await Promise.all([
      fetchFirebaseData(),
      fetchJSONData()
    ]);
    
    // Merge data, removing duplicates by ID (Firebase data takes precedence)
    const mergedData = [...firebaseData];
    const existingIds = new Set(firebaseData.map(p => p.id));
    
    jsonData.forEach(product => {
      if (!existingIds.has(product.id)) {
        mergedData.push(product);
      }
    });
    
    // Cache the merged data
    localStorage.setItem('productData', JSON.stringify(mergedData));
    localStorage.setItem('productData_ts', Date.now().toString());
    return mergedData;
  } catch (err) {
    console.error('[Fetch Fresh] Error:', err);
    return null;
  }
}

async function fetchData() {
  showLoading();
  const cached = localStorage.getItem('productData');
  const cachedAt = localStorage.getItem('productData_ts');
  const now = Date.now();

  let data = [];

  if (cached && cachedAt) {
    const isFresh = now - parseInt(cachedAt) < CACHE_TTL_MS;
    data = JSON.parse(cached);
    hideLoading();

    // Fetch in background if stale
    if (!isFresh) {
      console.log('[Cache] Expired. Fetching in background...');
      fetchFreshData().then(fresh => {
        if (fresh) {
          const oldHash = JSON.stringify(data);
          const newHash = JSON.stringify(fresh);
          if (oldHash !== newHash) {
            const notice = document.createElement('div');
            notice.style.cssText = `
              position: fixed; bottom: 10px; left: 50%; transform: translateX(-50%);
              background: #333; color: white; padding: 10px 20px; border-radius: 5px;
              font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 9999;
            `;
            const btn = document.createElement('button');
            btn.textContent = 'New products available. Click to refresh';
            btn.style.cssText = `
              background: #00c853; border: none; color: white; padding: 6px 12px;
              margin-left: 10px; border-radius: 4px; cursor: pointer;
            `;
            btn.onclick = () => location.reload();
            notice.appendChild(document.createTextNode('Update Available'));
            notice.appendChild(btn);
            document.body.appendChild(notice);
          }
        }
      });
    }

    return data;
  } else {
    const fresh = await fetchFreshData();
    data = fresh || [];
    hideLoading();
    return data;
  }
}

function renderPaginationControls(current, total) {
  const container = document.getElementById('pagination');

  function createButton(text, page, disabled = false) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.disabled = disabled;
    btn.style.cssText = `
      margin: 4px 2px;
      padding: 0.5em 1em;
      font-size: clamp(0.8rem, 1vw, 1rem);
      border: none;
      border-radius: 0.5em;
      background: ${disabled ? '#ccc' : '#3498db'};
      color: white;
      cursor: ${disabled ? 'default' : 'pointer'};
      max-width: 100%;
      flex-shrink: 1;
    `;
    if (!disabled) {
      btn.onclick = () => {
        currentPage = page;
        renderProducts(filteredData, currentPage);
      };
    }
    container.appendChild(btn);
  }

  createButton('<< First', 1, current === 1);
  createButton('< Prev 5', Math.max(1, current - 5), current <= 5);
  createButton('< Prev', current - 1, current === 1);

  createButton(`Page ${current}`, current, true);

  createButton('Next >', current + 1, current === total);
  createButton('Next 5 >', Math.min(total, current + 5), current + 5 > total);
  createButton('Last >>', total, current === total);
}

function renderProducts(products, page = 1) {
  const list = document.getElementById('productList');
  const pagination = document.getElementById('pagination');
  list.innerHTML = '';
  pagination.innerHTML = '';

  if (products.length === 0) {
    list.innerHTML = '<p>No products found.</p>';
    return;
  }

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedItems = products.slice(start, end);

  paginatedItems.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 50}ms`;
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image" />
      <h2>${product.name}</h2>
      <p><strong>Price:</strong> Rs ${product.price} /-</p>
      <p>${product.description}</p>
      <p><strong>Rating:</strong> ${product.rating} / 5</p>
      <p><strong>Stock:</strong> ${product.stock}</p>
      <p><strong>Status:</strong> ${product.available ? 'Available' : product.available_soon ? 
        `Available in ${product.estimated_days_to_availability} days` : 'Out of stock'}</p>
    `;
    list.appendChild(card);
  });

  renderPaginationControls(page, totalPages);
}

function searchProducts(data, query) {
  const lower = query.toLowerCase();
  return data.filter(item =>
    item.name.toLowerCase().includes(lower) ||
    item.description.toLowerCase().includes(lower) ||
    (item.tags || []).some(tag => tag.toLowerCase().includes(lower))
  );
}

fetchData().then(data => {
  filteredData = data;
  renderProducts(filteredData, currentPage);
  
  const input = document.getElementById('searchInput');
  input.addEventListener('input', (e) => {
    showLoading();
    setTimeout(() => {
      filteredData = searchProducts(data, e.target.value);
      currentPage = 1;
      renderProducts(filteredData, currentPage);
      hideLoading();
    }, 300);
  });
});

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.error('Service Worker registration failed:', err));
}
