const contextButtons = document.querySelectorAll(".context-pill");
const feedbackButtons = document.querySelectorAll(".feedback-options button");

contextButtons.forEach((button) => {
  button.addEventListener("click", () => {
    contextButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

feedbackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    feedbackButtons.forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
  });
});

if (window.lucide) {
  window.lucide.createIcons();
}
