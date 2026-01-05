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

// Safe localStorage wrapper with error handling
const storage = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('[Storage] Get failed:', e.message);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn('[Storage] Set failed:', e.message);
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('[Storage] Remove failed:', e.message);
      return false;
    }
  }
};

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
          console.warn(`[JSON] Failed to fetch ${url}: ${res.status}`);
          return [];
        })
        .catch(err => {
          console.warn(`[JSON] Error fetching ${url}:`, err.message);
          return [];
        })
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
  
  const cached = storage.get('productData');
  const cachedAt = storage.get('productData_ts');
  const now = Date.now();

  // Check cache first
  if (cached && cachedAt) {
    try {
      const timestamp = parseInt(cachedAt);
      if (isNaN(timestamp)) {
        throw new Error('Invalid timestamp');
      }
      
      const isFresh = now - timestamp < CACHE_TTL_MS;
      const cachedData = JSON.parse(cached);
      
      if (!Array.isArray(cachedData)) {
        throw new Error('Invalid cached data format');
      }
      
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
      storage.remove('productData');
      storage.remove('productData_ts');
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
    storage.set('productData', JSON.stringify(jsonData));
    storage.set('productData_ts', Date.now().toString());
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
      storage.set('productData', JSON.stringify(merged));
      storage.set('productData_ts', Date.now().toString());
      
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
  const existingIds = new Set(jsonData.map(p => p.id).filter(id => id != null));
  
  firebaseData.forEach(product => {
    if (product.id != null && !existingIds.has(product.id)) {
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
    
    if (merged.length > 0 && allData.length > 0) {
      const oldHash = JSON.stringify(allData.map(p => p.id).sort());
      const newHash = JSON.stringify(merged.map(p => p.id).sort());
      
      if (oldHash !== newHash) {
        console.log('[Update] New data detected');
        storage.set('productData', JSON.stringify(merged));
        storage.set('productData_ts', Date.now().toString());
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
    
    const productName = product.name || 'Unnamed Product';
    const productPrice = product.price || 'N/A';
    const productDesc = product.description || 'No description available';
    const productRating = product.rating || 'N/A';
    const productStock = product.stock || 'N/A';
    
    let statusText = 'Out of stock';
    if (product.available) {
      statusText = 'Available';
    } else if (product.available_soon && product.estimated_days_to_availability) {
      statusText = `Available in ${product.estimated_days_to_availability} days`;
    }
    
    card.innerHTML = `
      <img src="${product.image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22300%22 height=%22300%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2224%22 text-anchor=%22middle%22 x=%22150%22 y=%22160%22%3ENo Image%3C/text%3E%3C/svg%3E'}" 
           alt="${productName}" 
           class="product-image" 
           loading="lazy" 
           onerror="if(this.src.indexOf('data:image')===-1){this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22300%22 height=%22300%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2224%22 text-anchor=%22middle%22 x=%22150%22 y=%22160%22%3ENo Image%3C/text%3E%3C/svg%3E';this.onerror=null;}" />
      <h2>${productName}</h2>
      <p><strong>Price:</strong> Rs ${productPrice} /-</p>
      <p>${productDesc}</p>
      <p><strong>Rating:</strong> ${productRating} / 5</p>
      <p><strong>Stock:</strong> ${productStock}</p>
      <p><strong>Status:</strong> ${statusText}</p>
    `;
    list.appendChild(card);
  });

  console.log('[Render] Added', paginatedItems.length, 'cards to DOM');
  renderPaginationControls(page, totalPages);
}

function searchProducts(data, query) {
  if (!query || query.trim() === '') {
    return data;
  }
  
  const lower = query.toLowerCase().trim();
  return data.filter(item => {
    const name = (item.name || '').toLowerCase();
    const description = (item.description || '').toLowerCase();
    const tags = item.tags || [];
    
    return name.includes(lower) ||
           description.includes(lower) ||
           (Array.isArray(tags) && tags.some(tag => 
             typeof tag === 'string' && tag.toLowerCase().includes(lower)
           ));
  });
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

// Register service worker with better error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('[SW] Registered with scope:', registration.scope);
      })
      .catch(err => {
        console.warn('[SW] Registration failed:', err.message);
      });
  });
}
