// continue--reset

const continueReset = document.querySelector(".continue");
const container = document.querySelector(".successful");
const close = document.querySelector(".successful--close");
continueReset.addEventListener("click", function () {
  container.classList.add("show-continue");
});
close.addEventListener("click", () => {
  container.classList.remove("show-continue");
});
