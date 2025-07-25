export function evaluateQuiz(questions, userAnswers) {
  let score = 0;

  questions.forEach((q, i) => {
    if (userAnswers[i] === q.answer) score++;
  });

  const resultsBox = document.getElementById("resultsBox");
  resultsBox.innerHTML = `
    <div class="alert alert-success fw-bold">
      ✅ You scored ${score} out of ${questions.length}
    </div>
  `;

  document.getElementById("retakeBtn").classList.remove("d-none");
  document.getElementById("checkAnswersBtn").classList.remove("d-none");
  document.getElementById("finishBtn").disabled = true;
}

export function showAnswers(questions, userAnswers) {
  const container = document.getElementById("quizContainer");

  container.querySelectorAll(".question").forEach((div, i) => {
    const correct = questions[i].answer;
    const user = userAnswers[i];

    const feedback = document.createElement("div");
    feedback.className = "mt-2";

    feedback.innerHTML = user === correct
      ? `<span class="text-success fw-bold">✔ Correct</span>`
      : `<span class="text-danger fw-bold">✘ Incorrect</span><br><small>✅ Correct answer: <strong>${correct}</strong></small>`;

    div.appendChild(feedback);
  });
}
