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
  login();
});

const login = async () => {
  const email = userEmail.value;
  const password = userPassword.value;

  if (email.trim() === "") {
    WarningEmail.style.display = "block";
    WarningEmail.textContent = "Please enter a valid email";
    return;
  } else {
    WarningEmail.style.display = "none";
  }

  if (password.trim() === "") {
    WarningPassword.style.display = "block";
    WarningPassword.textContent = "Please enter a valid password";
    return;
  } else {
    WarningPassword.style.display = "none";
  }

  try {
    const response = await fetch("https://amica-a.onrender.com/users/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    let data = await response.json();

    if (response.ok) {
      localStorage.setItem(
        "user",
        JSON.stringify({ name: data.name, _id: data._id, email: data.email })
      );

      const queryParams = new URLSearchParams({
        message: `User created: ${data.name}`,
        email: email,
      }).toString();

      window.location.href = `/main/dashboard.html?${queryParams}`;
    } else {
      console.log(data);
      WarningPassword.style.display = "block";
      WarningPassword.textContent = data;
    }
  } catch (error) {
    console.error(error);
    WarningPassword.style.display = "block";
    WarningPassword.textContent = "Connect to the internet and try again";
  }
};
