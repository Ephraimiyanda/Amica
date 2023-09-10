const userName = document.getElementById("name");
const userEmail = document.getElementById("email");
const userPassword = document.getElementById("password");
const userPhone = document.getElementById("phone");
const warning = document.querySelector(".warning");

const button = document.getElementById("submit");
const preloader = document.querySelector(".preloader");
window.addEventListener("load", function () {
  preloader.classList.add("hide-preloader");
});

button.addEventListener("click", (e) => {
  e.preventDefault();
  finishSignUp();
});

const finishSignUp = async () => {
  console.log('button clicked')
  const name = userName.value.trim();
  const email = userEmail.value.trim();
  const password = userPassword.value.trim();
  const phone = userPhone.value.trim();

  if (name === "") {
    warning.style.display = "block";
    warning.textContent = "Please enter name";
    return; // Exit the function to prevent further execution
  } else if (email === "") {
    warning.style.display = "block";
    warning.textContent = "Please enter email";
    return; // Exit the function to prevent further execution
  } else if (password === "") {
    warning.style.display = "block";
    warning.textContent = "Please enter password";
    return; // Exit the function to prevent further execution
  } else if (password.length < 8) {
    warning.style.display = "block";
    warning.textContent = "Password should be at least 8 characters long";
    return; // Exit the function to prevent further execution
  } else if (phone === "") {
    warning.style.display = "block";
    warning.textContent = "Please enter phone";
    return; // Exit the function to prevent further execution
  } else {
    warning.style.display = "none";
  }
  try {
    const response = await fetch("https://amica-a.onrender.com/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail.value,
        password: userPassword.value,
        phone: userPhone.value,
        name: userName.value,
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
      warning.style.display = "block";
      warning.textContent = data;
    }
  } catch (error) {
    console.error(error);
    warning.style.display = "block";
    warning.textContent = "Connect to the internet and try again";
  }
};
