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
let allData = [];

function showLoading() {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.style.display = 'block';
}

function hideLoading() {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.style.display = 'none';
}

async function fetchFirebaseData() {
  try {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('[Firebase] Fetched:', Array.isArray(data) ? data.length : 'object', 'items');
      return Array.isArray(data) ? data : Object.values(data);
    } else {
      console.log('[Firebase] No data available');
      return [];
    }
  } catch (error) {
    console.warn('[Firebase] Failed:', error.message);
    return [];
  }
}

async function fetchJSONData() {
  try {
    const promises = DB_URLS.map(url => 
      fetch(url)
        .then(res => {
          if (res.ok) {
            console.log(`[JSON] ✓ ${url}`);
            return res.json();
          }
          return [];
        })
        .catch(() => [])
    );
    const results = await Promise.all(promises);
    const flatResults = results.flat();
    console.log(`[JSON] Total: ${flatResults.length} products`);
    return flatResults;
  } catch (err) {
    console.error('[JSON] Error:', err);
    return [];
  }
}

async function fetchData() {
  console.log('[Init] Starting data fetch...');
  showLoading();
  
  const cached = localStorage.getItem('productData');
  const cachedAt = localStorage.getItem('productData_ts');
  const now = Date.now();

  // Check cache first
  if (cached && cachedAt) {
    try {
      const isFresh = now - parseInt(cachedAt) < CACHE_TTL_MS;
      const cachedData = JSON.parse(cached);
      console.log(`[Cache] Found ${cachedData.length} products (${isFresh ? 'fresh' : 'stale'})`);
      
      // Display cached data immediately
      allData = cachedData;
      filteredData = cachedData;
      renderProducts(filteredData, currentPage);
      hideLoading();

      // Refresh in background if stale
      if (!isFresh) {
        console.log('[Cache] Refreshing in background...');
        refreshDataInBackground();
      }
      
      return cachedData;
    } catch (err) {
      console.error('[Cache] Parse error:', err);
      localStorage.removeItem('productData');
      localStorage.removeItem('productData_ts');
    }
  }

  // No cache: Fetch JSON first, always
  console.log('[Fetch] Loading JSON files...');
  const jsonData = await fetchJSONData();
  console.log('[Fetch] JSON returned:', jsonData.length, 'products');
  
  if (jsonData.length > 0) {
    // Display JSON data immediately
    allData = jsonData;
    filteredData = jsonData;
    console.log('[Render] Displaying', filteredData.length, 'JSON products');
    renderProducts(filteredData, currentPage);
    hideLoading();
    
    // Save JSON to cache
    try {
      localStorage.setItem('productData', JSON.stringify(jsonData));
      localStorage.setItem('productData_ts', Date.now().toString());
      console.log('[Cache] Saved', jsonData.length, 'products');
    } catch (err) {
      console.error('[Cache] Save error:', err);
    }
  } else {
    console.log('[Fetch] No JSON data available');
  }
  
  // Now fetch Firebase and merge (regardless of whether JSON had data)
  console.log('[Firebase] Starting fetch...');
  const firebaseData = await fetchFirebaseData();
  console.log('[Firebase] Returned:', firebaseData.length, 'products');
  
  if (firebaseData.length > 0) {
    const merged = mergeData(jsonData, firebaseData);
    console.log(`[Merge] Total products after merge: ${merged.length}`);
    
    if (merged.length > jsonData.length) {
      console.log(`[Firebase] Added ${merged.length - jsonData.length} new products`);
      allData = merged;
      filteredData = merged;
      
      // Update display with merged data
      renderProducts(filteredData, currentPage);
      
      // Update cache
      try {
        localStorage.setItem('productData', JSON.stringify(merged));
        localStorage.setItem('productData_ts', Date.now().toString());
        console.log('[Cache] Updated with merged data');
      } catch (err) {
        console.error('[Cache] Update error:', err);
      }
      
      // Only show notification if we added new products
      if (jsonData.length > 0) {
        showUpdateNotification();
      }
    }
  } else if (jsonData.length === 0) {
    // Neither source had data
    console.log('[Fetch] No data from any source');
    hideLoading();
  }
  
  return allData;
}

function mergeData(jsonData, firebaseData) {
  const merged = [...jsonData];
  const existingIds = new Set(jsonData.map(p => p.id));
  
  firebaseData.forEach(product => {
    if (!existingIds.has(product.id)) {
      merged.push(product);
    }
  });
  
  return merged;
}

async function refreshDataInBackground() {
  try {
    const [jsonData, firebaseData] = await Promise.all([
      fetchJSONData(),
      fetchFirebaseData()
    ]);
    
    const merged = mergeData(jsonData, firebaseData);
    
    if (merged.length > 0) {
      const oldHash = JSON.stringify(allData);
      const newHash = JSON.stringify(merged);
      
      if (oldHash !== newHash) {
        console.log('[Update] New data detected');
        localStorage.setItem('productData', JSON.stringify(merged));
        localStorage.setItem('productData_ts', Date.now().toString());
        showUpdateNotification();
      }
    }
  } catch (err) {
    console.error('[Refresh] Error:', err);
  }
}

function showUpdateNotification() {
  const existing = document.getElementById('update-notification');
  if (existing) return;
  
  const notice = document.createElement('div');
  notice.id = 'update-notification';
  notice.style.cssText = `
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    background: #333; color: white; padding: 12px 20px; border-radius: 8px;
    font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 9999;
    display: flex; align-items: center; gap: 12px;
  `;
  
  const text = document.createElement('span');
  text.textContent = 'New products available!';
  
  const btn = document.createElement('button');
  btn.textContent = 'Refresh';
  btn.style.cssText = `
    background: #00c853; border: none; color: white; padding: 6px 16px;
    border-radius: 4px; cursor: pointer; font-weight: 600;
  `;
  btn.onclick = () => location.reload();
  
  notice.appendChild(text);
  notice.appendChild(btn);
  document.body.appendChild(notice);
}

function renderPaginationControls(current, total) {
  const container = document.getElementById('pagination');
  if (!container) {
    console.error('[Pagination] Container not found!');
    return;
  }
  
  container.innerHTML = '';

  if (total <= 1) return;

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
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    }
    container.appendChild(btn);
  }

  createButton('<< First', 1, current === 1);
  createButton('< Prev 5', Math.max(1, current - 5), current <= 5);
  createButton('< Prev', current - 1, current === 1);
  createButton(`Page ${current} of ${total}`, current, true);
  createButton('Next >', current + 1, current === total);
  createButton('Next 5 >', Math.min(total, current + 5), current + 5 > total);
  createButton('Last >>', total, current === total);
}

function renderProducts(products, page = 1) {
  console.log('[Render] Called with', products.length, 'products, page', page);
  
  const list = document.getElementById('productList');
  const pagination = document.getElementById('pagination');
  
  if (!list) {
    console.error('[Render] productList element not found!');
    return;
  }
  if (!pagination) {
    console.error('[Render] pagination element not found!');
    return;
  }
  
  list.innerHTML = '';
  pagination.innerHTML = '';

  if (products.length === 0) {
    list.innerHTML = '<p style="text-align:center; padding:2rem; color:#666; font-size:1.2rem;">No products found.</p>';
    console.log('[Render] No products to display');
    return;
  }

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedItems = products.slice(start, end);
  
  console.log('[Render] Showing items', start, 'to', end, '/', products.length);

paginatedItems.forEach((product, index) => {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.style.animationDelay = `${index * 50}ms`;

  const img = document.createElement('img');
  img.src = product.image || 'placeholder.jpg';
  img.alt = product.name || 'Product';
  img.className = 'product-image';
  img.loading = 'lazy';
  img.addEventListener('error', () => {
    img.src = 'https://via.placeholder.com/300x300?text=No+Image';
  });

  card.appendChild(img);
  card.insertAdjacentHTML('beforeend', `
    <h2>${product.name || 'Unnamed Product'}</h2>
    <p><strong>Price:</strong> Rs ${product.price || 'N/A'} /-</p>
    <p>${product.description || 'No description available'}</p>
    <p><strong>Rating:</strong> ${product.rating || 'N/A'} / 5</p>
    <p><strong>Stock:</strong> ${product.stock || 'N/A'}</p>
    <p><strong>Status:</strong> ${
      product.available
        ? 'Available'
        : product.available_soon
          ? `Available in ${product.estimated_days_to_availability} days`
          : 'Out of stock'
    }</p>
  `);

  list.appendChild(card);
});


  console.log('[Render] Added', paginatedItems.length, 'cards to DOM');
  renderPaginationControls(page, totalPages);
}

function searchProducts(data, query) {
  const lower = query.toLowerCase();
  return data.filter(item =>
    (item.name || '').toLowerCase().includes(lower) ||
    (item.description || '').toLowerCase().includes(lower) ||
    (item.tags || []).some(tag => tag.toLowerCase().includes(lower))
  );
}

// Initialize - wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function initApp() {
  console.log('[App] DOM ready, initializing...');
  
  fetchData().then(data => {
    console.log('[App] Data loaded:', data.length, 'products');
    
    const input = document.getElementById('searchInput');
    if (input) {
      input.addEventListener('input', (e) => {
        const query = e.target.value;
        console.log('[Search] Query:', query);
        filteredData = searchProducts(allData, query);
        currentPage = 1;
        renderProducts(filteredData, currentPage);
      });
      console.log('[App] Search listener attached');
    } else {
      console.error('[App] searchInput element not found!');
    }
  }).catch(err => {
    console.error('[App] Fatal error:', err);
    hideLoading();
  });
}

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('[SW] Registered'))
    .catch(err => console.warn('[SW] Registration failed:', err));
}
