// =======================
// DOM References
// =======================
const cartButton = document.getElementById("cartButton");
const checkout = document.getElementById("checkout");
const closeCheckoutButton = document.getElementById("closeCheckout");
const itemName = document.getElementById("itemName");
const itemPrice = document.getElementById("itemPrice");
const cursor = document.getElementById("cursor");
const buyButtons = document.querySelectorAll("button[data-name][data-price]");
const scrollProgress = document.getElementById("scrollProgress");
const cartToast = document.getElementById("cartToast");
const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");

// =======================
// UI State
// =======================
let cartCount = 0;
let lastFocusedElement = null;
let toastTimeout = null;

// =======================
// Smooth Scroll (Lenis)
// =======================
if (typeof Lenis !== "undefined") {
  const lenis = new Lenis();
  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

// =======================
// Custom Cursor
// =======================
if (window.matchMedia("(hover: hover)").matches && cursor) {
  document.addEventListener("mousemove", (event) => {
    cursor.style.transform = `translate(${event.clientX - 20}px, ${event.clientY - 20}px)`;
  });
}

// =======================
// UI Helpers
// =======================
function updateCartLabel() {
  cartButton.textContent = `Cart (${cartCount})`;
}

function showToast(message) {
  if (!cartToast) return;
  cartToast.textContent = message;
  cartToast.classList.add("show");
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    cartToast.classList.remove("show");
  }, 1500);
}

// =======================
// Checkout Modal
// =======================
function openCheckout(name, price) {
  itemName.textContent = name;
  itemPrice.textContent = typeof price === "number" ? `${price}€` : String(price);
  checkout.classList.remove("hidden");
  checkout.classList.add("flex");
  checkout.setAttribute("aria-hidden", "false");
  document.body.classList.add("checkout-open");
  lastFocusedElement = document.activeElement;
  closeCheckoutButton.focus();
}

function closeCheckout() {
  checkout.classList.add("hidden");
  checkout.classList.remove("flex");
  checkout.setAttribute("aria-hidden", "true");
  document.body.classList.remove("checkout-open");
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

// =======================
// Product Actions
// =======================
buyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    cartCount += 1;
    updateCartLabel();
    showToast(`${name} ajouté`);
    openCheckout(name, price);
  });
});

cartButton.addEventListener("click", () => {
  openCheckout("Panier", "Voir total");
});

// =======================
// Modal Events
// =======================
closeCheckoutButton.addEventListener("click", closeCheckout);

checkout.addEventListener("click", (event) => {
  if (event.target === checkout) {
    closeCheckout();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !checkout.classList.contains("hidden")) {
    closeCheckout();
  }
});

// =======================
// Scroll Progress
// =======================
window.addEventListener("scroll", () => {
  if (!scrollProgress) return;
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
});

// =======================
// Newsletter Form
// =======================
if (newsletterForm && newsletterEmail) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = newsletterEmail.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValid) {
      showToast("Email invalide");
      newsletterEmail.focus();
      return;
    }

    showToast("Inscription confirmée");
    newsletterForm.reset();
  });
}
