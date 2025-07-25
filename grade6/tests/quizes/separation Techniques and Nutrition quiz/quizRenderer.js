export function renderQuiz(questions, userAnswers) {
  const container = document.getElementById("quizContainer");
  container.innerHTML = "";

  // Make questions globally accessible for narration
  window.questions = questions;

  questions.forEach((q, i) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question mb-4 p-3 border rounded";

    // Optional image
    const imageHTML = q.image
      ? `<img src="${q.image}" alt="Question Image" class="img-fluid mb-2" />`
      : "";

    // Options HTML
    const optionsHTML = q.options.map(opt => `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="q${i}" value="${opt}" id="q${i}-${opt}" 
          onchange="recordAnswer(${i}, '${sanitizeText(opt)}')">
        <label class="form-check-label" for="q${i}-${opt}">${opt}</label>
      </div>
    `).join("");

    // Full question block
    questionDiv.innerHTML = `
      ${imageHTML}
      <div class="d-flex gap-2 mb-2">
        <button onclick="speakText('${sanitizeText(q.question)}')" class="btn btn-sm btn-outline-secondary">🔊 Listen</button>
        <button onclick="speakFullQuestion(${i})" class="btn btn-sm btn-outline-primary">🔊 Listen All</button>
      </div>
      <p><strong>Q${i + 1}:</strong> ${q.question}</p>
      ${optionsHTML}
    `;

    container.appendChild(questionDiv);
  });

  // Record answer globally
  window.recordAnswer = (index, value) => {
    userAnswers[index] = value;
  };
}

// Escape quotes for safe inline JS
function sanitizeText(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, "\\\"");
}
