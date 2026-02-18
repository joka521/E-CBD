
// IMPORTANT : Assurez-vous que cette configuration est la même que dans admin.js
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_AUTH_DOMAIN",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_STORAGE_BUCKET",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fonction pour charger les produits et les afficher
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = ''; // Vider la grille existante

    db.collection("products").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productId = doc.id;

            // Créer la carte produit
            const productCard = document.createElement('article');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <div class="product-content">
                    <h2>${product.name}</h2>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-terpenes">${product.aromas || ''}</span>
                        <span class="product-type">${product.type || ''}</span>
                    </div>
                    <p class="product-price">${product.price.toFixed(2)} € / 2 g</p>
                    <button class="btn-primary" onclick='addToCart({ id: "${productId}", name: "${product.name}", price: ${product.price} })'>
                        Ajouter au panier
                    </button>
                     <a href="#" class="btn-secondary">Voir le produit complet</a>
                </div>
            `;

            productsGrid.appendChild(productCard);
        });
    });
}

// Appeler la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', loadProducts);
