// -------- Cart dropdown ----------
const cartIcon = document.getElementById("cart-icon");
const cartDropdown = document.getElementById("cart-dropdown");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");

// Toggle dropdown
cartIcon.addEventListener("click", (e) => {
  e.preventDefault();
  const willOpen = cartDropdown.style.display !== "block";
  cartDropdown.style.display = willOpen ? "block" : "none";
  cartIcon.setAttribute("aria-expanded", String(willOpen));
});

// Click outside to close cart
document.addEventListener("click", (e) => {
  const insideCart = cartDropdown.contains(e.target) || cartIcon.contains(e.target);
  if (!insideCart) {
    cartDropdown.style.display = "none";
    cartIcon.setAttribute("aria-expanded", "false");
  }
});

// Demo: add item (replace with real add-to-cart)
function addToCart(productName, price, quantity, imgSrc) {
  cartCount.textContent = quantity;
  cartCount.style.display = "inline";

  cartItems.innerHTML = `
    <div class="cart-item">
      <img src="${imgSrc}" width="50" height="50" alt="">
      <div>
        <p>${productName}</p>
        <p>$${price} x ${quantity} <b>$${(price * quantity).toFixed(2)}</b></p>
      </div>
      <button onclick="removeItem()" aria-label="Remove">
        <img src="./images/icon-delete.svg" alt="">
      </button>
      <div style="flex-basis:100%;"></div>
      <button class="checkout-btn">Checkout</button>
    </div>
  `;
}
function removeItem() {
  cartCount.style.display = "none";
  cartItems.innerHTML = `<p>Your cart is empty.</p>`;
}
// demo call
addToCart("Fall Limited Edition Sneakers", 125.00, 2, "images/image-product-1-thumbnail.jpg");

// -------- Mobile off-canvas menu ----------
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const mmClose = document.getElementById("mm-close");
const mmBackdrop = document.querySelector(".mm-backdrop");

// open
function openMenu() {
  mobileMenu.classList.add("open");
  mobileMenu.setAttribute("aria-hidden", "false");
  hamburger.setAttribute("aria-expanded", "true");
  document.body.classList.add("body-lock");
}
// close
function closeMenu() {
  mobileMenu.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  hamburger.setAttribute("aria-expanded", "false");
  document.body.classList.remove("body-lock");
}

hamburger.addEventListener("click", openMenu);
mmClose.addEventListener("click", closeMenu);
mmBackdrop.addEventListener("click", closeMenu);

// close with Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
    closeMenu();
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const images = [
    "./images/image-product-1.jpg",
    "./images/image-product-2.jpg",
    "./images/image-product-3.jpg",
    "./images/image-product-4.jpg"
  ];

  let currentIndex = 0;

  const mainImg   = document.getElementById("currentImage");
  const prevBtn   = document.querySelector(".prev");
  const nextBtn   = document.querySelector(".next");
  const thumbButtons = Array.from(document.querySelectorAll(".thumb"));

  function highlightThumbnail(index) {
    thumbButtons.forEach((btn, i) => {
      btn.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  }

  function showImage(index) {
    currentIndex = (index + images.length) % images.length;
    mainImg.src = images[currentIndex];
    highlightThumbnail(currentIndex);
    if (lightbox && lightbox.classList.contains("open")) showLb(currentIndex);
  }

  // gallery controls
  nextBtn.addEventListener("click", () => showImage(currentIndex + 1));
  prevBtn.addEventListener("click", () => showImage(currentIndex - 1));
  thumbButtons.forEach((btn, i) => btn.addEventListener("click", () => showImage(i)));

  // Quantity controls
  const qtyInput = document.getElementById("qtyInput");
  const minus = document.querySelector(".qty .minus");
  const plus  = document.querySelector(".qty .plus");
  const clampQty = () => {
    const n = Math.max(1, parseInt(qtyInput.value || "1", 10));
    qtyInput.value = n;
    return n;
  };
  minus.addEventListener("click", () => { qtyInput.value = Math.max(1, clampQty() - 1); });
  plus.addEventListener("click", () => { qtyInput.value = clampQty() + 1; });
  qtyInput.addEventListener("change", clampQty);

  // Add-to-cart feedback (stub)
  const addBtn = document.querySelector(".add-to-cart");
  addBtn.addEventListener("click", () => {
    const qty = clampQty();
    addBtn.disabled = true;
    const old = addBtn.textContent;
    addBtn.textContent = `Added ${qty} to cart`;
    setTimeout(() => { addBtn.textContent = old; addBtn.disabled = false; }, 1200);
  });

  // ---------- Lightbox ----------
  const lightbox  = document.getElementById("lightbox");
  const lbImage   = document.getElementById("lbImage");
  const lbPrev    = document.querySelector(".lb-prev");
  const lbNext    = document.querySelector(".lb-next");
  const lbThumbs  = Array.from(document.querySelectorAll(".lb-thumb"));
  const lbBackdrop= document.querySelector(".lb-backdrop");
  const lbClosers = Array.from(document.querySelectorAll("[data-close]"));
  let lastFocused = null;

  function setLbActive(i){
    lbThumbs.forEach((b, k) => b.setAttribute("aria-selected", k === i ? "true" : "false"));
  }
  function showLb(i){
    const idx = (i + images.length) % images.length;
    lbImage.src = images[idx];
    setLbActive(idx);
    currentIndex = idx;
  }
  function openLb(i = currentIndex){
    lastFocused = document.activeElement;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    showLb(i);
    lbNext.focus();
  }
  function closeLb(){
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  // open on main image click
  mainImg.addEventListener("click", () => openLb(currentIndex));

  // lightbox controls
  lbPrev.addEventListener("click", () => showLb(currentIndex - 1));
  lbNext.addEventListener("click", () => showLb(currentIndex + 1));
  lbThumbs.forEach((b, i) => b.addEventListener("click", () => showLb(i)));
  lbBackdrop.addEventListener("click", closeLb);
  lbClosers.forEach(el => el.addEventListener("click", closeLb));

  // keyboard for lightbox
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight") showLb(currentIndex + 1);
    if (e.key === "ArrowLeft") showLb(currentIndex - 1);
  });

  // initial
  showImage(0);
});