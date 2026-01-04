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
      console.log('[Firebase] Data fetched successfully');
      return snapshot.val();
    } else {
      console.log('[Firebase] No data available');
      return [];
    }
  } catch (error) {
    console.warn('[Firebase] Failed to fetch:', error.message);
    return [];
  }
}

async function fetchJSONData() {
  try {
    const promises = DB_URLS.map(url => 
      fetch(url)
        .then(res => {
          if (res.ok) {
            console.log(`[JSON] ✓ Loaded ${url}`);
            return res.json();
          }
          return [];
        })
        .catch(() => [])
    );
    const results = await Promise.all(promises);
    const flatResults = results.flat();
    console.log(`[JSON] Total products: ${flatResults.length}`);
    return flatResults;
  } catch (err) {
    console.error('[JSON] Error:', err);
    return [];
  }
}

async function fetchData() {
  showLoading();
  const cached = localStorage.getItem('productData');
  const cachedAt = localStorage.getItem('productData_ts');
  const now = Date.now();

  // Check cache first
  if (cached && cachedAt) {
    const isFresh = now - parseInt(cachedAt) < CACHE_TTL_MS;
    const cachedData = JSON.parse(cached);
    console.log(`[Cache] Using cached data (${cachedData.length} products)`);
    
    // Display cached data immediately
    allData = cachedData;
    filteredData = cachedData;
    renderProducts(filteredData, currentPage);
    hideLoading();

    // Refresh in background if stale
    if (!isFresh) {
      console.log('[Cache] Stale, refreshing in background...');
      refreshDataInBackground();
    }
    
    return cachedData;
  }

  // No cache: Fetch JSON immediately and display
  console.log('[Fetch] Loading JSON...');
  const jsonData = await fetchJSONData();
  
  if (jsonData.length > 0) {
    // Display JSON data immediately
    allData = jsonData;
    filteredData = jsonData;
    renderProducts(filteredData, currentPage);
    hideLoading();
    
    // Save to cache
    localStorage.setItem('productData', JSON.stringify(jsonData));
    localStorage.setItem('productData_ts', Date.now().toString());
    
    // Fetch Firebase in background and merge if available
    console.log('[Firebase] Fetching in background...');
    fetchFirebaseData().then(firebaseData => {
      if (firebaseData.length > 0) {
        const merged = mergeData(jsonData, firebaseData);
        if (merged.length > jsonData.length) {
          console.log(`[Firebase] Added ${merged.length - jsonData.length} new products`);
          allData = merged;
          
          // Update cache with merged data
          localStorage.setItem('productData', JSON.stringify(merged));
          localStorage.setItem('productData_ts', Date.now().toString());
          
          // Show update notification
          showUpdateNotification();
        }
      }
    });
    
    return jsonData;
  }
  
  // Fallback: No JSON data, try Firebase
  console.log('[Fetch] No JSON data, trying Firebase...');
  const firebaseData = await fetchFirebaseData();
  allData = firebaseData;
  filteredData = firebaseData;
  renderProducts(filteredData, currentPage);
  hideLoading();
  
  if (firebaseData.length > 0) {
    localStorage.setItem('productData', JSON.stringify(firebaseData));
    localStorage.setItem('productData_ts', Date.now().toString());
  }
  
  return firebaseData;
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
        console.log('[Update] New data available');
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
  const list = document.getElementById('productList');
  const pagination = document.getElementById('pagination');
  list.innerHTML = '';
  pagination.innerHTML = '';

  if (products.length === 0) {
    list.innerHTML = '<p style="text-align:center; padding:2rem; color:#666;">No products found.</p>';
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
      <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" />
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

// Initialize
fetchData().then(data => {
  const input = document.getElementById('searchInput');
  input.addEventListener('input', (e) => {
    const query = e.target.value;
    filteredData = searchProducts(allData, query);
    currentPage = 1;
    renderProducts(filteredData, currentPage);
  });
});

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('[SW] Registered'))
    .catch(err => console.warn('[SW] Registration failed:', err));
}
