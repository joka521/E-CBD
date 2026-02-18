// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByBbwrKpNzVO5jsx1ndtsFngxPka4xEoE",
  authDomain: "e-cbd-e294c.firebaseapp.com",
  projectId: "e-cbd-e294c",
  storageBucket: "e-cbd-e294c.firebasestorage.app",
  messagingSenderId: "478234146675",
  appId: "1:478234146675:web:0f862ea311fe519a407706",
  measurementId: "G-CX5PMWBF88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginContainer = document.getElementById('login-container');
const adminPanel = document.getElementById('admin-panel');
const productList = document.getElementById('product-list');

// Le mot de passe pour l'admin. Pour plus de sécurité, il ne devrait pas être ici en clair.
// Pour ce tutoriel, nous le laissons ici pour que vous puissiez le changer facilement.
const ADMIN_PASSWORD = "JOAQUIM"; 
const ADMIN_EMAIL = "jokaaie@gmail.com"; // Email factice pour l'authentification

function login() {
    const password = document.getElementById('password').value;
    if (password === ADMIN_PASSWORD) {
        auth.signInWithEmailAndPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
            .then((userCredential) => {
                loginContainer.style.display = 'none';
                adminPanel.style.display = 'block';
                loadProducts();
            })
            .catch((error) => {
                // Pour la première connexion, nous créons l'utilisateur
                if (error.code === 'auth/user-not-found') {
                    auth.createUserWithEmailAndPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
                        .then(() => {
                            loginContainer.style.display = 'none';
                            adminPanel.style.display = 'block';
                            loadProducts();
                        })
                        .catch(err => alert("Erreur lors de la création de l'utilisateur: " + err.message));
                } else if (error.code === 'auth/wrong-password') {
                    alert('Mot de passe incorrect.');
                } else {
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
    db.collection("products").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productId = doc.id;
            const productElement = document.createElement('div');
            productElement.innerHTML = `
                <hr>
                <input type="text" value="${product.name}" id="name-${productId}">
                <textarea id="desc-${productId}">${product.description}</textarea>
                <input type="number" value="${product.price}" id="price-${productId}">
                <input type="text" value="${product.image}" id="image-${productId}">
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

    db.collection("products").add({
        name,
        description,
        price,
        image
    })
    .then(() => {
        alert("Produit ajouté !");
        loadProducts(); // Recharger la liste
    })
    .catch(error => alert("Erreur: " + error));
}

function updateProduct(id) {
    const name = document.getElementById(`name-${id}`).value;
    const description = document.getElementById(`desc-${id}`).value;
    const price = parseFloat(document.getElementById(`price-${id}`).value);
    const image = document.getElementById(`image-${id}`).value;

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
            loadProducts(); // Recharger la liste
        })
        .catch(error => alert("Erreur: " + error));
    }
}

// Vérifier si l'utilisateur est déjà connecté
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
