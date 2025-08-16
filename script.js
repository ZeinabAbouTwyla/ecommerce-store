fetch('products.json')
  .then(response => response.json())
  .then(products => {
    let container = document.getElementById('products-container');

    // Function to get random products
    function getRandomProducts(products, count) {
      let shuffled = products.slice().sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }
    
    let latestProducts = getRandomProducts(products, 8);

    // Function to render products
    function renderProducts(list) {
      container.innerHTML = ''; 
      list.forEach(product => {
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
          <div class="product" data-id="${product.id}" style="position: relative;">
            ${saleHTML}
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${priceHTML}</p>
            <button class="buy-btn" data-id="${product.id}">أضف الى السلة</button>
          </div>
        `;
      });

      // Add purchase event listeners
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
          let product = products.find(p => p.id == id);

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

      // Add double-click event for product details
      document.querySelectorAll(".product").forEach(productElement => {
        productElement.addEventListener("dblclick", () => {
          let id = productElement.getAttribute("data-id");
          window.location.href = `product-details.html?id=${id}`;
        });
        
        productElement.style.cursor = "pointer";
        productElement.title = "اضغط مرتين لعرض التفاصيل";
      });
    }

    renderProducts(latestProducts);

    // View All Products button handler
    const allProductsBtn = document.getElementById("all-products-btn");
    if (allProductsBtn) {
      allProductsBtn.addEventListener("click", () => {
        window.location.href = "all-products.html"; 
      });
    }

    // Update cart count function
    function updateCartCount() {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const cartCount = document.getElementById("cart-count");
      if (cartCount) {
        cartCount.textContent = cart.length;
      }
    }

    updateCartCount();
  })
  .catch(error => console.error('خطأ في تحميل المنتجات:', error));

// Additional CSS for sale badges
const additionalStyles = `
  .sale-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #e74c3c;
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: bold;
    z-index: 10;
  }
  
  .discount-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #f39c12;
    color: white;
    padding: 5px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: bold;
    z-index: 10;
  }
  
  .original-price {
    text-decoration: line-through;
    color: #999;
    font-size: 0.9em;
    margin-right: 5px;
  }
  
  .sale-price {
    color: #e74c3c;
    font-weight: bold;
  }
`;

// Add styles to head
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);