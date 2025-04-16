document.getElementById("hamburger-btn").addEventListener("click", () => {
  const navLinks = document.getElementById("nav-links");
  navLinks.classList.toggle("hidden");
});

let currentIndex = 0;
const sliderImages = document.getElementById("slider-images");
const totalImages = sliderImages.children.length;

document.getElementById("prev-btn").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + totalImages) % totalImages;
  updateSlider();
});

document.getElementById("next-btn").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % totalImages;
  updateSlider();
});

function updateSlider() {
  const offset = -currentIndex * 100;
  sliderImages.style.transform = `translateX(${offset}%)`;
}

const cartItemsEl = document.getElementById("cart-items");
const totalEl = document.getElementById("total");
const clearCartBtn = document.getElementById("clear-cart");

let cart = JSON.parse(localStorage.getItem('momoCart')) || [];

const menuItems = [
  { name: "Steamed Veggie Momo", price: 7.00 },
  { name: "Steamed Chicken Momo", price: 8.00 },
  { name: "Steamed Beef Momo", price: 9.00 },
  { name: "Fried Veggie Momo", price: 8.00 },
  { name: "Fried Chicken Momo", price: 9.00 },
  { name: "Fried Beef Momo", price: 10.00 },
  { name: "Chilli Veggie Momo", price: 9.00 },
  { name: "Chilli Chicken Momo", price: 9.00 },
  { name: "Chilli Beef Momo", price: 10.00 },
  { name: "Soup Veggie Momo", price: 8.00 },
  { name: "Soup Chicken Momo", price: 9.00 },
  { name: "Soup Beef Momo", price: 10.00 },
  { name: "Bhatmas Sadheko", price: 6.00 },
  { name: "Sel Roti", price: 1.50 },
  { name: "Hot Coffee", price: 2.00 }
];

// Convert existing menu items to clickable items with data attributes
document.addEventListener('DOMContentLoaded', function() {
  const menuSection = document.querySelector('#menu .grid');
  
  if (menuSection) {
    // Clear existing menu items
    menuSection.innerHTML = '';
    
    // Add each menu item with proper data attributes
    menuItems.forEach(item => {
      const menuItemDiv = document.createElement('div');
      menuItemDiv.className = 'menu-item cursor-pointer hover:bg-gray-50 transition-colors';
      menuItemDiv.dataset.name = item.name;
      menuItemDiv.dataset.price = item.price;
      menuItemDiv.innerHTML = `
        ${item.name} - $${item.price.toFixed(2)}
        <button class="ml-2 bg-green-500 text-white px-2 py-1 rounded text-sm">Add to Cart</button>
      `;
      menuSection.appendChild(menuItemDiv);
    });
  }
  
  // Initialize cart display
  renderCart();
  
  // Add event listeners to menu items
  addMenuItemListeners();
});

function addMenuItemListeners() {
  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", () => {
      const name = item.dataset.name;
      const price = parseFloat(item.dataset.price);

      const existingItem = cart.find(i => i.name === name);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      // Save cart to localStorage
      localStorage.setItem('momoCart', JSON.stringify(cart));
      
      // Show feedback
      showAddedToCartMessage(name);
      
      renderCart();
    });
  });
}

function showAddedToCartMessage(itemName) {
  const message = document.createElement('div');
  message.className = 'fixed top-4 right-4 bg-green-500 text-white p-3 rounded shadow-lg z-50';
  message.textContent = `Added ${itemName} to cart!`;
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.classList.add('opacity-0', 'transition-opacity');
    setTimeout(() => document.body.removeChild(message), 500);
  }, 2000);
}

clearCartBtn.addEventListener("click", () => {
  cart = [];
  localStorage.setItem('momoCart', JSON.stringify(cart));
  renderCart();
});

function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "text-center py-4";
    emptyMessage.textContent = "Your cart is empty";
    cartItemsEl.appendChild(emptyMessage);
  } else {
    cart.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "flex justify-between items-center py-2 border-b last:border-0";
      
      const itemDetails = document.createElement("div");
      itemDetails.textContent = `${item.name} x${item.quantity}`;
      
      const priceActions = document.createElement("div");
      priceActions.className = "flex items-center";
      
      const price = document.createElement("span");
      price.className = "mr-4";
      price.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
      
      const removeBtn = document.createElement("button");
      removeBtn.className = "text-red-500 hover:text-red-700";
      removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeFromCart(index);
      });
      
      const quantityControls = document.createElement("div");
      quantityControls.className = "flex items-center ml-4";
      
      const decrementBtn = document.createElement("button");
      decrementBtn.className = "px-2 bg-gray-200 hover:bg-gray-300 rounded-l";
      decrementBtn.textContent = "-";
      decrementBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        decrementQuantity(index);
      });
      
      const quantityDisplay = document.createElement("span");
      quantityDisplay.className = "px-3 bg-gray-100";
      quantityDisplay.textContent = item.quantity;
      
      const incrementBtn = document.createElement("button");
      incrementBtn.className = "px-2 bg-gray-200 hover:bg-gray-300 rounded-r";
      incrementBtn.textContent = "+";
      incrementBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        incrementQuantity(index);
      });
      
      quantityControls.appendChild(decrementBtn);
      quantityControls.appendChild(quantityDisplay);
      quantityControls.appendChild(incrementBtn);
      
      priceActions.appendChild(price);
      priceActions.appendChild(removeBtn);
      priceActions.appendChild(quantityControls);
      
      li.appendChild(itemDetails);
      li.appendChild(priceActions);
      
      cartItemsEl.appendChild(li);
      total += item.price * item.quantity;
    });
  }

  totalEl.textContent = `Total: $${total.toFixed(2)}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('momoCart', JSON.stringify(cart));
  renderCart();
}

function decrementQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  localStorage.setItem('momoCart', JSON.stringify(cart));
  renderCart();
}

function incrementQuantity(index) {
  cart[index].quantity++;
  localStorage.setItem('momoCart', JSON.stringify(cart));
  renderCart();
}