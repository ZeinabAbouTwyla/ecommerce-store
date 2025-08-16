function displayCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let container = document.getElementById("cart-container");
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>سلة المشتريات فارغة</p>";
    document.getElementById("total-price").textContent = "0";
    return;
  }

  let total = 0;

  cart.forEach((product, index) => {
    total += parseFloat(product.price);

    container.innerHTML += `
      <div class="product" data-id="${product.id}" style="cursor: pointer;" title="اضغط مرتين لعرض التفاصيل">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.price} ج.م</p>
        <button class="remove-btn" data-index="${index}">حذف</button>
      </div>
    `;
  });

  // عرض الإجمالي
  document.getElementById("total-price").textContent = total.toFixed(2);

  // زر الحذف لكل منتج
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      let index = btn.getAttribute("data-index");
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
      updateCartCount();
    });
  });

  // إضافة حدث الضغط المزدوج لكل منتج في السلة
  document.querySelectorAll(".product").forEach(productElement => {
    productElement.addEventListener("dblclick", () => {
      let id = productElement.getAttribute("data-id");
      window.location.href = `product-details.html?id=${id}`;
    });
  });
}

// زر إفراغ السلة
document.getElementById("clear-cart").addEventListener("click", () => {
  if (confirm("هل أنت متأكد من إفراغ السلة؟")) {
    localStorage.removeItem("cart");
    displayCart();
    updateCartCount();
  }
});

// زر الشراء النهائي (تحويل لصفحة الدفع)
document.getElementById("checkout-btn").addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!user) {
    alert('يجب تسجيل الدخول أولاً لإتمام عملية الشراء');
    window.location.href = 'log.html';
    return;
  }
  
  if (cart.length === 0) {
    alert("السلة فارغة!");
    return;
  }
  
  window.location.href = "checkout.html";
});

// دالة تحديث عداد السلة
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

// استدعاء الدوال عند تحميل الصفحة
displayCart();
updateCartCount();