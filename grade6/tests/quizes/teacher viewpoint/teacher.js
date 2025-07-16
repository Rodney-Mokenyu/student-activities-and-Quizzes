import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

 const firebaseConfig = {
    apiKey: "AIzaSyCpXpy72_xXEl57uLFDOZ2-R1qaBRVJKMo",
    authDomain: "grade6-quizone.firebaseapp.com",
    projectId: "grade6-quizone",
    storageBucket: "grade6-quizone.firebasestorage.app",
    messagingSenderId: "666095696372",
    appId: "1:666095696372:web:8faff771be291d2a5c21a1",
    measurementId: "G-PE0SD5F9WJ"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const resultsTable = document.getElementById("resultsTable");

async function loadResults() {
  const snapshot = await getDocs(collection(db, "quiz_results"));
  if (snapshot.empty) {
    resultsTable.innerHTML = `<tr><td colspan="4">No results found.</td></tr>`;
    return;
  }

  const rows = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    const date = new Date(data.timestamp).toLocaleString();
    rows.push(`
      <tr>
        <td>${data.name}</td>
        <td>${data.score}</td>
        <td>${data.total}</td>
        <td>${date}</td>
      </tr>
    `);
  });

  resultsTable.innerHTML = rows.join("");
}

loadResults();
