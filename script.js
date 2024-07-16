// Product class
class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

// ShoppingCartItem class
class ShoppingCartItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    getTotalPrice() {
        return this.product.price * this.quantity;
    }
}

// ShoppingCart class
class ShoppingCart {
    constructor() {
        this.items = [];
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
    }

    addItem(shoppingCartItem) {
        let existingItem = this.items.find(item => item.product.id === shoppingCartItem.product.id);
        if (existingItem) {
            existingItem.quantity += shoppingCartItem.quantity;
        } else {
            this.items.push(shoppingCartItem);
        }
        this.saveCart();
    }

    updateItemQuantity(productId, quantity) {
        let item = this.items.find(item => item.product.id === productId);
        if (item) {
            item.quantity += quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
            }
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.saveCart();
    }

    clearCart() {
        this.items = [];
        this.saveCart();
    }

    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    }

    loadCart() {
        const storedItems = localStorage.getItem('shoppingCart');
        if (storedItems) {
            this.items = JSON.parse(storedItems).map(item => new ShoppingCartItem(new Product(item.product.id, item.product.name, item.product.price), item.quantity));
        }
    }

    displayCart() {
        const cartItemsDiv = document.getElementById('cart-items');
        cartItemsDiv.innerHTML = '';

        this.items.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <p>${item.product.name} - Quantity: 
                <button onclick="updateItemQuantity(${item.product.id}, -1)">-</button>
                ${item.quantity}
                <button onclick="updateItemQuantity(${item.product.id}, 1)">+</button>
                - Total Price: $${item.getTotalPrice()}</p>
                <button onclick="removeFromCart(${item.product.id})">Remove</button>
            `;
            cartItemsDiv.appendChild(cartItemDiv);
        });

        document.getElementById('total-items').textContent = this.getTotalItems();
        document.getElementById('total-price').textContent = this.getTotalPrice();
    }
}

// Sample products
const products = [
    new Product(1, 'T-shirt', 20),
    new Product(2, 'Jeans', 50),
    new Product(3, 'Shoes', 80)
];

// Create product elements in HTML
const productListDiv = document.getElementById('product-list');
products.forEach(product => {
    const productItemDiv = document.createElement('div');
    productItemDiv.classList.add('product-item');
    productItemDiv.innerHTML = `
        <img src="images/${product.name}.jpg" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Price: $${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productListDiv.appendChild(productItemDiv);
});

// Initialize shopping cart
const cart = new ShoppingCart();
cart.loadCart();
cart.displayCart();

// Function to add product to cart
function addToCart(productId) {
    const product = products.find(prod => prod.id === productId);
    if (product) {
        const quantity = 1; // Default quantity to add
        const shoppingCartItem = new ShoppingCartItem(product, quantity);
        cart.addItem(shoppingCartItem);
        cart.displayCart();
    }
}

// Function to update item quantity in cart
function updateItemQuantity(productId, quantity) {
    cart.updateItemQuantity(productId, quantity);
    cart.displayCart();
}

// Function to remove product from cart
function removeFromCart(productId) {
    cart.removeItem(productId);
    cart.displayCart();
}

// Function to clear cart
function clearCart() {
    cart.clearCart();
    cart.displayCart();
}
