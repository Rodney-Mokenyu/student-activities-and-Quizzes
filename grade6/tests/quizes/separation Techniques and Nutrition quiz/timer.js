let timer;
let timeLeft = 0;

export function startTimer(seconds, onExpire) {
  timeLeft = seconds;
  updateTimerDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      onExpire();
    }
  }, 1000);
}

export function clearTimer() {
  clearInterval(timer);
}

function updateTimerDisplay() {
  const timerBox = document.getElementById("timerBox");
  if (timerBox) {
    timerBox.textContent = `⏳ Time left: ${timeLeft}s`;
    timerBox.classList.toggle("text-danger", timeLeft <= 5);
  }
}
