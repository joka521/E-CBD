const CART_KEY = 'e_cbd_cart';

function getCart() {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
  let cart = getCart();
  const index = cart.findIndex(item => item.id === product.id);
  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  saveCart(cart);
  alert('Produit ajouté au panier');
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  renderCart();
}

function updateQuantity(id, quantity) {
  let cart = getCart();
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) {
    const q = parseInt(quantity, 10);
    if (q > 0) {
      cart[index].quantity = q;
    } else {
      cart.splice(index, 1);
    }
  }
  saveCart(cart);
  renderCart();
}

function getTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const container = document.getElementById('cart-container');
  const totalEl = document.getElementById('cart-total');

  if (!container || !totalEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = '<p>Votre panier est vide.</p>';
    totalEl.textContent = '';
    return;
  }

  let html = '<table style="width:100%; border-collapse:collapse;">';
  html += '<thead><tr><th style="text-align:left; padding:0.5rem 0;">Produit</th><th>Prix</th><th>Quantité</th><th>Total</th><th></th></tr></thead><tbody>';

  cart.forEach(item => {
    html += `
      <tr>
        <td style="padding:0.5rem 0;">${item.name}</td>
        <td style="text-align:center;">${item.price.toFixed(2)} €</td>
        <td style="text-align:center;">
          <input type="number" min="1" value="${item.quantity}" 
                 onchange="updateQuantity('${item.id}', this.value)" 
                 style="width:60px; padding:0.1rem 0.25rem;">
        </td>
        <td style="text-align:center;">${(item.price * item.quantity).toFixed(2)} €</td>
        <td style="text-align:center;">
          <button onclick="removeFromCart('${item.id}')" style="border:none; background:none; color:#b91c1c; cursor:pointer;">
            Supprimer
          </button>
        </td>
      </tr>
    `;
  });

  html += '</tbody></table>';

  container.innerHTML = html;
  totalEl.textContent = 'Total : ' + getTotal().toFixed(2) + ' €';
}

document.addEventListener('DOMContentLoaded', renderCart);

