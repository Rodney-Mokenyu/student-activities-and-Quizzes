// ✅ Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ Firebase Config
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

// ✅ DOM Elements
const startBtn = document.getElementById("startBtn");
const nameInput = document.getElementById("studentNameInput");
const startScreen = document.getElementById("startScreen");
const quizContainer = document.getElementById("quizContainer");
const quizBox = document.getElementById("quizBox");
const timerEl = document.getElementById("timer");
const scoreBtn = document.getElementById("scoreBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const finishBtn = document.getElementById("finishBtn");
const questionCounter = document.getElementById("questionCounter");
const retakeBtn = document.getElementById("retakeBtn");

// ✅ Quiz State
let studentName = "";
let currentIndex = 0;
let selectedAnswers = [];
let timer = null;
let timeLeft = 0;
let tickSound = new Audio("clock-tick.mp3");
tickSound.volume = 0.4; // optional: reduce volume

// ✅ Quiz Questions
const questions = [
  {
    question: "Which of the following is a mixture?",
    options: { A: "Sand", B: "Iron", C: "Gold", D: "Salt water" },
    answer: "D"
  },
  {
    question: "Mali has a mixture of fine sand and small stones. What technique can she use to separate the fine sand from the stones?",
    options: { A: "Filtration", B: "Magnet attraction", C: "Sifting", D: "Decantation" },
    answer: "C"
  },
  {
    question: "Which of the following mixtures can be best separated by magnetic attraction?",
    options: { A: "Sugar and pepper", B: "Oil and water", C: "Wood chips and stones", D: "Iron and sulfur" },
    answer: "D"
  },
  {
    question: "We can use a ___________ to separate a mixture of sand and salt solution.",
    options: { A: "sieve", B: "magnet", C: "alum", D: "filter paper" },
    answer: "D"
  },
  {
    question: "What is the technique that can be used to separate cherry tomatoes from nuts?",
    options: { A: "Filtration", B: "Precipitation", C: "Handpicking", D: "Decantation" },
    answer: "C"
  },
  {
    question: "Sifting is used to separate a mixture of different sized __________",
    options: { A: "sediments", B: "solids", C: "liquids", D: "gases" },
    answer: "B"
  },
  {
    question: "The diagram shows the set-up of the apparatus of a separation technique. What is represented by X?",
    options: { A: "Residue", B: "Filtrate", C: "Precipitate", D: "Alum" },
    answer: "B",
    image: "question7_Image.jpg"
  },
  {
    question: "What name is given to the solid which collects in the filter paper during filtration?",
    options: { A: "Filtrate", B: "Residue", C: "Distillate", D: "Precipitate" },
    answer: "B"
  },
  {
    question: "Decantation is used to _____________.",
    options: { A: "separate a liquid from a soluble solid", B: "separate a liquid from an insoluble solid", C: "separate a mixture of two liquids", D: "separate solids of different sizes" },
    answer: "B"
  },
  {
    question: "Which of the following statements is true about precipitation?",
    options: {
      A: "Using layers of different stones and sand",
      B: "Allowing the solid in a liquid to settle to the bottom of a container before the liquid is poured off the top",
      C: "Allowing water to evaporate, leaving a solid residue behind",
      D: "Converting a substance that dissolves in a liquid into a solid by adding other substance"
    },
    answer: "D"
  }
];

// ✅ Enable Start button only when name is typed
nameInput.addEventListener("input", () => {
  const hasName = /\w/.test(nameInput.value);
  startBtn.disabled = !hasName;
});

// ✅ Start Quiz
startBtn.addEventListener("click", () => {
  studentName = nameInput.value.trim();
  if (!studentName) return;

  startScreen.classList.add("d-none");
  quizContainer.classList.remove("d-none");

  selectedAnswers = new Array(questions.length).fill(null);
  currentIndex = 0;
  timeLeft = questions.length * 45;

  startTimer();
  renderQuestion();
});

// ✅ Timer Logic
function startTimer() {
  updateTimer();
  timer = setInterval(() => {
    timeLeft--;
    tickSound.currentTime = 0; // reset before playing
    tickSound.play().catch(() => {}); // in case of autoplay restrictions
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

/* function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerEl.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, "0")}`;

  if (timeLeft <= 10) {
    timerEl.classList.replace("bg-success", "bg-danger");
  }
} */
let warningSound = new Audio("time-warning.mp3"); // Add this to your project folder
warningSound.preload = "auto";

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  // Update timer text
  document.getElementById("timerText").textContent = display;

  // Update ring progress
  const ring = document.getElementById("timerRing");
  const fullDash = 2 * Math.PI * 36;
  const percentLeft = timeLeft / (questions.length * 45);
  ring.style.strokeDashoffset = fullDash * (1 - percentLeft);

  // Change color and sound alert in last 10 seconds
  if (timeLeft <= 10) {
    ring.setAttribute("stroke", "#dc3545"); // red
    document.getElementById("timerText").classList.replace("text-dark", "text-danger");

    if (timeLeft === 10) {
      warningSound.play().catch(() => {});
    }
  }
}



// ✅ Render Question
function renderQuestion() {
  const q = questions[currentIndex];
  quizBox.innerHTML = `
    <div><strong>Q${currentIndex + 1}:</strong> ${q.question}</div>
    ${q.image ? `<img src="${q.image}" alt="question image" class="img-fluid my-3" />` : ""}
    <div class="mt-3">
      ${Object.entries(q.options).map(([key, value]) =>
        `<div class="option ${selectedAnswers[currentIndex] === key ? "selected" : ""}" data-value="${key}">${key}: ${value}</div>`
      ).join('')}
    </div>
  `;

  questionCounter.textContent = `Question ${currentIndex + 1} of ${questions.length}`;

  prevBtn.disabled = currentIndex === 0;
  nextBtn.classList.toggle("d-none", currentIndex === questions.length - 1);
  finishBtn.classList.toggle("d-none", currentIndex !== questions.length - 1);

  // Reattach option click events
  document.querySelectorAll(".option").forEach(opt => {
    opt.addEventListener("click", () => {
      selectedAnswers[currentIndex] = opt.dataset.value;
      renderQuestion();
    });
  });
}

// ✅ End Quiz
async function endQuiz() {
  clearInterval(timer);

  let score = 0;
  questions.forEach((q, i) => {
    if (selectedAnswers[i] === q.answer) score++;
  });

  scoreBtn.textContent = `Score: ${score}/${questions.length}`;
  scoreBtn.classList.remove("d-none");

  quizBox.innerHTML = `<h2 class="text-success">You scored ${score} out of ${questions.length}!</h2>`;
  prevBtn.disabled = true;
  nextBtn.classList.add("d-none");
  finishBtn.classList.add("d-none");

  await saveResult(score);
  retakeBtn.classList.remove("d-none");

}

// ✅ Save Result to Firestore
async function saveResult(score) {
  try {
    await addDoc(collection(db, "quiz_results"), {
      name: studentName,
      score,
      total: questions.length,
      answers: selectedAnswers,
      timestamp: Date.now()
    });
    console.log("✅ Quiz result saved to Firestore");
  } catch (err) {
    console.error("❌ Error saving result:", err);
  }
}

// ✅ Navigation Buttons
prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
});

finishBtn.addEventListener("click", () => {
  clearInterval(timer);
  endQuiz();
});
retakeBtn.addEventListener("click", () => {
  // Reset all quiz state
  currentIndex = 0;
  selectedAnswers = new Array(questions.length).fill(null);
  timeLeft = questions.length * 45;

  // Hide buttons
  scoreBtn.classList.add("d-none");
  retakeBtn.classList.add("d-none");

  // Reset timer styles
  document.getElementById("timerText").classList.remove("text-danger");
  document.getElementById("timerText").classList.add("text-dark");
  document.getElementById("timerRing").setAttribute("stroke", "#28a745");
  document.getElementById("timerRing").style.strokeDashoffset = 0;

  // Show quiz again
  quizContainer.classList.remove("d-none");

  // Start new quiz
  renderQuestion();
  startTimer();
});
