let allProducts = [];
let filteredProducts = [];

fetch('products.json')
  .then(response => response.json())
  .then(products => {
    allProducts = products;
    filteredProducts = [...products];
    renderProducts(filteredProducts);
    
    // Setup event listeners
    setupFilters();
  })
  .catch(error => console.error('خطأ في تحميل المنتجات:', error));

function renderProducts(productList) {
  let container = document.getElementById('products-container');
  let noResults = document.getElementById('no-results');
  
  container.innerHTML = '';
  
  if (productList.length === 0) {
    noResults.style.display = 'block';
    container.style.display = 'none';
    return;
  }
  
  noResults.style.display = 'none';
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.justifyContent = 'center';
  container.style.gap = '20px';
  container.style.padding = '20px';

  productList.forEach(product => {
    // Check if product has sale/discount
    let saleHTML = '';
    let priceHTML = '';
    
    if (product.onSale) {
      saleHTML = '<div class="sale-badge">تخفيض</div>';
    }
    
    if (product.discount) {
      saleHTML += `<div class="discount-badge">-${product.discount}%</div>`;
    }
    
    if (product.originalPrice && product.originalPrice > product.price) {
      priceHTML = `
        <span class="original-price">${product.originalPrice} ج.م</span>
        <span class="sale-price">${product.price} ج.م</span>
      `;
    } else {
      priceHTML = `${product.price} ج.م`;
    }

    container.innerHTML += `
      <div class="product" data-id="${product.id}">
        ${saleHTML}
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${priceHTML}</p>
        <button class="buy-btn" data-id="${product.id}">أضف الى السلة</button>
      </div>
    `;
  });

  // Add event listeners
  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      
      // Check if user is logged in
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user) {
        alert('يجب تسجيل الدخول أولاً للتمكن من إضافة المنتجات إلى السلة');
        window.location.href = 'log.html';
        return;
      }
      
      let id = btn.getAttribute("data-id");
      let product = allProducts.find(p => p.id == id);

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));

      // Visual feedback
      const originalText = btn.textContent;
      btn.textContent = 'تم الإضافة!';
      btn.style.background = '#28a745';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '#bfa871';
      }, 1500);

      updateCartCount();
    });
  });

  // Double click for details
  document.querySelectorAll(".product").forEach(productElement => {
    productElement.addEventListener("dblclick", () => {
      let id = productElement.getAttribute("data-id");
      window.location.href = `product-details.html?id=${id}`;
    });
    
    productElement.style.cursor = "pointer";
    productElement.title = "اضغط مرتين لعرض التفاصيل";
  });
}

function setupFilters() {
  const searchInput = document.getElementById('searchInput');
  const priceFilter = document.getElementById('priceFilter');
  const sortFilter = document.getElementById('sortFilter');

  // Search functionality
  searchInput.addEventListener('input', applyFilters);
  
  // Filter functionality
  priceFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
  let filtered = [...allProducts];
  
  // Apply search filter
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply price filter
  const priceRange = document.getElementById('priceFilter').value;
  if (priceRange) {
    if (priceRange === '0-400') {
      filtered = filtered.filter(product => product.price < 400);
    } else if (priceRange === '400-600') {
      filtered = filtered.filter(product => product.price >= 400 && product.price <= 600);
    } else if (priceRange === '600-800') {
      filtered = filtered.filter(product => product.price > 600 && product.price <= 800);
    } else if (priceRange === '800+') {
      filtered = filtered.filter(product => product.price > 800);
    }
  }
  
  // Apply sorting
  const sortOption = document.getElementById('sortFilter').value;
  if (sortOption === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'name-az') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'name-za') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }
  
  filteredProducts = filtered;
  renderProducts(filteredProducts);
}

function clearAllFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('priceFilter').value = '';
  document.getElementById('sortFilter').value = '';
  
  filteredProducts = [...allProducts];
  renderProducts(filteredProducts);
}

// Update cart count
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

// Initial cart count update
updateCartCount();