// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyByBbwrKpNzVO5jsx1ndtsFngxPka4xEoE",
  authDomain: "e-cbd-e294c.firebaseapp.com",
  projectId: "e-cbd-e294c",
  storageBucket: "e-cbd-e294c.appspot.com",
  messagingSenderId: "478234146675",
  appId: "1:478234146675:web:0f862ea311fe519a407706",
  measurementId: "G-CX5PMWBF88"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginContainer = document.getElementById('login-container');
const adminPanel = document.getElementById('admin-panel');
const productList = document.getElementById('product-list');

// Le mot de passe pour l'admin. 
const ADMIN_PASSWORD = "JOAQUIM"; 
const ADMIN_EMAIL = "jokaaie@gmail.com"; // Email pour l'authentification

function login() {
    const password = document.getElementById('password').value;
    if (password === ADMIN_PASSWORD) {
        // Essayer de se connecter
        auth.signInWithEmailAndPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
            .then((userCredential) => {
                // Succès
                loginContainer.style.display = 'none';
                adminPanel.style.display = 'block';
                loadProducts();
            })
            .catch((error) => {
                // Si l'utilisateur n'existe pas, on le crée
                if (error.code === 'auth/user-not-found') {
                    auth.createUserWithEmailAndPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
                        .then(() => {
                            // La connexion est automatique après la création
                            loginContainer.style.display = 'none';
                            adminPanel.style.display = 'block';
                            loadProducts();
                        })
                        .catch(err => alert("Erreur critique lors de la création de l'utilisateur: " + err.message));
                } else if (error.code === 'auth/wrong-password') {
                    alert('Mot de passe incorrect.');
                } else {
                    // Afficher les autres erreurs possibles
                    alert("Erreur de connexion: " + error.message);
                }
            });
    } else {
        alert('Mot de passe incorrect.');
    }
}

function logout() {
    auth.signOut().then(() => {
        loginContainer.style.display = 'block';
        adminPanel.style.display = 'none';
    });
}

function loadProducts() {
    productList.innerHTML = '';
    db.collection("products").orderBy("name").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productId = doc.id;
            const productElement = document.createElement('div');
            productElement.innerHTML = `
                <hr>
                <p><strong>${product.name}</strong></p>
                <input type="text" value="${product.name}" id="name-${productId}" placeholder="Nom">
                <textarea id="desc-${productId}" placeholder="Description">${product.description}</textarea>
                <input type="number" value="${product.price}" id="price-${productId}" placeholder="Prix">
                <input type="text" value="${product.image}" id="image-${productId}" placeholder="URL Image">
                <button onclick="updateProduct('${productId}')">Mettre à jour</button>
                <button onclick="deleteProduct('${productId}')">Supprimer</button>
            `;
            productList.appendChild(productElement);
        });
    });
}

function addProduct() {
    const name = document.getElementById('new-product-name').value;
    const description = document.getElementById('new-product-desc').value;
    const price = parseFloat(document.getElementById('new-product-price').value);
    const image = document.getElementById('new-product-image').value;

    if (!name || !description || isNaN(price) || !image) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    db.collection("products").add({
        name,
        description,
        price,
        image
    })
    .then(() => {
        alert("Produit ajouté !");
        document.getElementById('new-product-name').value = '';
        document.getElementById('new-product-desc').value = '';
        document.getElementById('new-product-price').value = '';
        document.getElementById('new-product-image').value = '';
        loadProducts();
    })
    .catch(error => alert("Erreur: " + error));
}

function updateProduct(id) {
    const name = document.getElementById(`name-${id}`).value;
    const description = document.getElementById(`desc-${id}`).value;
    const price = parseFloat(document.getElementById(`price-${id}`).value);
    const image = document.getElementById(`image-${id}`).value;

    if (!name || !description || isNaN(price) || !image) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    db.collection("products").doc(id).update({
        name,
        description,
        price,
        image
    })
    .then(() => alert("Produit mis à jour !"))
    .catch(error => alert("Erreur: " + error));
}

function deleteProduct(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
        db.collection("products").doc(id).delete()
        .then(() => {
            alert("Produit supprimé !");
            loadProducts();
        })
        .catch(error => alert("Erreur: " + error));
    }
}

// Gérer l'état de connexion au chargement de la page
auth.onAuthStateChanged((user) => {
  if (user) {
    loginContainer.style.display = 'none';
    adminPanel.style.display = 'block';
    loadProducts();
  } else {
    loginContainer.style.display = 'block';
    adminPanel.style.display = 'none';
  }
});
