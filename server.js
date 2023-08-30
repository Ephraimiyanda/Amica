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
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Request failed with status " + response.status);
      }
    })
    .then((data) => {
      localStorage.setItem("user", JSON.stringify({ name: data.name, _id: data._id }));
      const queryParams = new URLSearchParams({
        message: `User created: ${data.name}`,
        email: email,
      }).toString();
      window.location.href = `/main/dashboard.html?${queryParams}`;
    })
    .catch((error) => {
      console.error(error);
      WarningPassword.style.display = "block";
      WarningPassword.textContent = "Wrong password";
    });
  })  
