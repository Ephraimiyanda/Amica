const userEmail = document.getElementById("email");
const userPassword = document.getElementById("password");
const button = document.getElementById("submit");
const preloader = document.querySelector(".preloader");
const WarningEmail = document.querySelector(".warining--email");
const WarningPassword = document.querySelector(".warning--password");

window.addEventListener("load", function () {
  preloader.classList.add("hide-preloader");
});

button.addEventListener("click", (e) => {
  e.preventDefault();

  const email = userEmail.value;
  const password = userPassword.value;

  if (email.trim() === "") {
    // Show an error message or perform any desired action
    WarningEmail.style.display = "block";
    WarningEmail.textContent = "please enter a valid Email";
    return; // Exit the function to prevent further execution
  } else {
    WarningEmail.style.display = "none";
  }
  if (password.trim() === "") {
    WarningPassword.style.display = "block";
    WarningPassword.textContent = "please enter a valid password";
    return;
  } else {
    WarningPassword.style.display = "none";
  }

  // Store email and password in Local Storage
  localStorage.setItem("email", email);
  localStorage.setItem("password", password);

  fetch("https://amica-a.onrender.com/users/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      const queryParams = new URLSearchParams({
        message: `User created: ${data.name}`,
        email: email,
      }).toString();
      window.location.href = `./main/dashboard.html?${queryParams}`;
    })
    .catch((err) => {
      console.log(err);
      WarningPassword.style.display = "block";
      WarningPassword.textContent = "Wrong password";
    });
});
