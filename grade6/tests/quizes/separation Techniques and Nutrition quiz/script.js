import { renderQuiz } from './quizRenderer.js';
import { startTimer, clearTimer } from './timer.js';
import { evaluateQuiz, showAnswers } from './evaluator.js';

window.addEventListener("load", () => {
  const availableVoices = speechSynthesis.getVoices();
  const thaiVoice = availableVoices.find(v => v.lang === "th-TH");
  const englishVoice = availableVoices.find(v => v.lang === "en-US");

  if (!thaiVoice || !englishVoice) {
    console.warn("Some voices may not be available on this device.");
  }
});

document.getElementById("voiceSelect").value = "en-US"; //  setting default voice to English


const categorySelect = document.getElementById("categorySelect");
const questionBankPath = "question-bank/";
let questions = [];
let userAnswers = [];

const categories = {
  nutrition: "Food, Nutrition & Digestion",
  separation: "Separation Techniques",
  staticElectricity: "Static Electricity"
};

function populateCategoryDropdown() {
  categorySelect.innerHTML = "";
  for (const [key, label] of Object.entries(categories)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = label;
    categorySelect.appendChild(option);
  }
}

populateCategoryDropdown();

document.getElementById("startBtn").addEventListener("click", async () => {
  const category = categorySelect.value;
  const res = await fetch(`${questionBankPath}/${category}.json`);
  const data = await res.json();
  questions = shuffleArray(data[category]);
  userAnswers = Array(questions.length).fill(null);

  renderQuiz(questions, userAnswers);
  startTimer(questions.length * 40, () => evaluateQuiz(questions, userAnswers));
  document.getElementById("finishBtn").disabled = false;
});

document.getElementById("finishBtn").addEventListener("click", () => {
  if (userAnswers.includes(null)) {
    alert("Please answer all questions before finishing.");
    return;
  }
  clearTimer();
  evaluateQuiz(questions, userAnswers);
});

document.getElementById("retakeBtn").addEventListener("click", () => location.reload());
document.getElementById("checkAnswersBtn").addEventListener("click", () => showAnswers(questions, userAnswers));

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

window.speakText = function(text) {
  const lang = document.getElementById("voiceSelect").value;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  speechSynthesis.speak(utterance);
};
window.speakFullQuestion = function(index) {
  const lang = document.getElementById("voiceSelect").value;
  const q = window.questions[index]; // assuming questions are globally accessible
  const utterance = new SpeechSynthesisUtterance(`${q.question}. Options are: ${q.options.join(', ')}`);
  utterance.lang = lang;
  speechSynthesis.speak(utterance);
};
