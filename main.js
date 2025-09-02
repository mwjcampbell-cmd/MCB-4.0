// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, enableIndexedDbPersistence, collection, addDoc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBW5iWg5mCgbzjF9MBdR32VJi4uX2JHf0A",
  authDomain: "mcb-database-b9815.firebaseapp.com",
  projectId: "mcb-database-b9815",
  storageBucket: "mcb-database-b9815.firebasestorage.app",
  messagingSenderId: "541175340452",
  appId: "1:541175340452:web:156f7c14ef081bde633531",
  measurementId: "G-Y2DY5J84RL"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch(err => {
  console.error("Firestore persistence error", err);
});

// Auth
const provider = new GoogleAuthProvider();
document.getElementById("loginBtn").onclick = login;
document.getElementById("loginBtn2").onclick = login;
document.getElementById("logoutBtn").onclick = () => signOut(auth);

function login() {
  signInWithPopup(auth, provider).catch(console.error);
}

// Auth state
onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("signedOut").style.display = "none";
    document.getElementById("appContent").style.display = "block";
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("loginBtn2").style.display = "none";
    document.getElementById("logoutBtn").style.display = "inline-block";
    document.getElementById("userName").textContent = user.displayName;
  } else {
    document.getElementById("signedOut").style.display = "block";
    document.getElementById("appContent").style.display = "none";
    document.getElementById("loginBtn").style.display = "inline-block";
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("userName").textContent = "";
  }
});

// Sync button (reloads data)
document.getElementById("syncBtn").onclick = async () => {
  alert("Data sync triggered");
};

// Navigation
document.querySelectorAll(".dropdown-content a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll("main section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(link.dataset.page).classList.add("active");
  });
});

// Example Firestore write
document.getElementById("addTaskBtn").onclick = async () => {
  const task = document.getElementById("newTask").value.trim();
  if (task) {
    await addDoc(collection(db, "tasks"), { text: task, created: Date.now() });
    document.getElementById("newTask").value = "";
  }
};

// Live updates
onSnapshot(collection(db, "tasks"), snap => {
  let html = "";
  snap.forEach(doc => {
    html += `<div class="panel">${doc.data().text}</div>`;
  });
  document.getElementById("tasksList").innerHTML = html;
});
