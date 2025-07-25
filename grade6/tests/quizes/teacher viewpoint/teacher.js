import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
  resultsTable.innerHTML = ""; // Clear previous results
  if (snapshot.empty) {
    resultsTable.innerHTML = `<tr><td colspan="4">No results found.</td></tr>`;
    return;
  }

  const rows = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    const date = new Date(data.timestamp).toLocaleString();
    let scoreColor;
    if (data.score >= 8) {
      scoreColor = "green";
    } else if (data.score >= 6) {
      scoreColor = "orange";
    } else if (data.score >= 5) {
      scoreColor = "blue";
    } else {
      scoreColor = "red";
    }

    rows.push(`
      <tr>
      <td>${data.name}</td>
      <td style="color: ${scoreColor}; font-weight: bold;">${data.score}</td>
      <td>${data.total}</td>
      <td>${date}</td>
      </tr>
    `);
  });

  resultsTable.innerHTML = rows.join("");
}

loadResults();

/* Clear results button functionality */

// 5) **Insert your Clear-All button logic here**, at the bottom**

const clearResultsBtn = document.getElementById("clearResultsBtn");
clearResultsBtn.addEventListener("click", async () => {
  if (!confirm("Are you sure you want to clear all results?")) return;

  // Fetch all quiz_results docs
  const snapshot = await getDocs(collection(db, "quiz_results"));

  // Fire off parallel deletes
  const deletes = snapshot.docs.map((snap) =>
    deleteDoc(doc(db, "quiz_results", snap.id))
  );

  // Wait for them all
  await Promise.all(deletes);

  alert("All results cleared.");
  loadResults(); // refresh the table
});


// add logic to color the  Score based on its value

// ✅ Load results on page load
document.addEventListener("DOMContentLoaded", loadResults);