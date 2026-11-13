import { saveToStorage, getFromStorage } from "../js/storage.js";

const CART_KEY = "cart";

const state = {
    products: [
        { id: 1, name: "Mandazi (pack of 6)", price: 120, image: "🥯" },
        { id: 2, name: "Chapati (pack of 5)", price: 100, image: "🫓" },
        { id: 3, name: "Tea leaves 250g", price: 180, image: "🍵" },
        { id: 4, name: "Sugar 1kg", price: 100, image: "🍬" },
        { id: 5, name: "Milk 1L", price: 90, image: "🥛" },
        { id: 6, name: "Bread loaf", price: 80, image: "🍞" },
        { id: 7, name: "Eggs ", price: 200, image: "🥚" },
    ],
    cart: getFromStorage(CART_KEY, []), // { productId, quantity }
};

const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

function saveCart() {
    saveToStorage(CART_KEY, state.cart);
}

function addToCart(productId) {
    const existing = state.cart.find((item) => item.productId === productId);
    if (existing) {
        existing.quantity++;
    } else {
        state.cart.push({ productId, quantity: 1 });
    }
    saveCart();
    renderCart();
}

// Calculated values: never stored
function getCartTotal() {
    return state.cart.reduce((total, item) => {
        const product = state.products.find((p) => p.id === item.productId);
        return total + product.price * item.quantity;
    }, 0);
}

function getCartCount() {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
}

function renderProducts() {
    productList.innerHTML = "";
    state.products.forEach((product) => {
        const li = document.createElement("li");
        li.textContent = `${product.image} ${product.name} - KES ${product.price} `;
        const btn = document.createElement("button");
        btn.textContent = "Add to Cart";
        btn.addEventListener("click", () => addToCart(product.id));
        li.append(btn);
        productList.appendChild(li);
    });
}

function renderCart() {
    cartList.innerHTML = "";
    state.cart.forEach((item) => {
        const product = state.products.find((p) => p.id === item.productId);
        const li = document.createElement("li");
        li.textContent = `${product.name} x ${item.quantity} = KES ${product.price * item.quantity}`;
        cartList.appendChild(li);
    });
    cartCount.textContent = getCartCount();
    cartTotal.textContent = getCartTotal();
}

renderProducts();
renderCart();
