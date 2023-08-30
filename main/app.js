const toggleBtn = document.querySelector(".sidebar-toggle");
const dashboard = document.querySelector(".dashBoard");
const profile = document.querySelector(".notification--img");
const profileClose = document.querySelector(".profile--close");
const mainProfile = document.querySelector(".profile");
const userImage = document.querySelector(".profile--pic");
const file = document.querySelector("#file");
const upload = document.querySelector(".profile-input");
const toggleTImage = document.querySelector(".header--image");
const notificationImage = document.querySelector(".notification--img");
const userName = document.querySelector(".username");
const profileName = document.querySelector(".profile--username");
const profileEmail = document.querySelector(".profile--email");
const logout = document.querySelector(".logout");
const search = document.querySelector("#search");
const searchBtn = document.querySelector('#searchBtn')

// Search
searchBtn.addEventListener('click', function (e) {
  const searchValue = search.value.trim();
  console.log(searchValue);
})

toggleBtn.addEventListener("click", function () {
  dashboard.classList.toggle("show-sidebar");
  toggleBtn.classList.toggle('open');
});

profile.addEventListener("click", () => {
  mainProfile.classList.toggle("show--profile");
});
profileClose.addEventListener("click", () => {
  mainProfile.classList.remove("show--profile");
});
logout.addEventListener("click", loggingout);

// Pic Upload
file.addEventListener("change", async function (e) {
  const getuserId = localStorage.getItem("user");
  const userId = JSON.parse(getuserId);
  // console.log(userId._id); 
  try {
    const url = `https://amica-a.onrender.com/users/${userId._id}/upload-picture`;

    const reader = new FormData(document.getElementById("myForm"));
    reader.append('image', e.target.files[0]);
    console.log('clickeddd');

    const response = await fetch(url, {
      method: 'POST',
      body: reader
    });

    const data = await response.json();
    if(response.ok) {
      console.log(data);
      location.reload();
      const imgDatastored = data
      localStorage.setItem("profileImage", imgDatastored);
    } else {
      console.log('AN error occured');
      console.log({err: data});
    }
  } catch (err) {
    console.log(err);
  };
});

const preloader = document.querySelector(".preloader");
window.addEventListener("load", function () {
  preloader.classList.add("hide-preloader");
});
document.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("email");
  const storedUsername = localStorage.getItem("username");
  userName.textContent = ` Hello, ${storedUsername}`;
  profileName.textContent = storedUsername;
  profileEmail.textContent = email;
  const image = localStorage.getItem("profileImage");
  userImage.src = image;
  toggleTImage.src = image;
  notificationImage.src = image;
});


 async function displayChart () {
  const getuserId = localStorage.getItem("user");
  const userId = JSON.parse(getuserId);
  // console.log(userId._id);  
try {
  const response = await fetch(`https://amica-a.onrender.com/users/${userId._id}/profit`);
   if(response.ok){
    const data = await response.json()
    // console.log(data);
    const labels = data.map((item) => item.date);
    const income = data.map((item) => item.totalSales);
    const expenses = data.map((item) => item.totalExpenses);

    // console.log(values);
    // Step 3: Set up your Chart.js chart
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
      // {console.log(values)};
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Income",
            data: income,
            backgroundColor: ["rgba(54, 162, 235, 0.2)"],
            borderColor: ["rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
          {
            label: "Expense",
            data: expenses,
            backgroundColor:["#2007b4"],
            borderColor: ["#2007b4"],
            borderWidth: 1,
          }
        ],
      },
      options: {
        maintainAspectRatio: false,
        locale: "en-NG",
        scales: {
          y: {
            ticks: {
              callback: (value, index, values) => {
                // return value;
                return new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  maximumSignificantDigits: 3,
                }).format(value);
              },
            },
            beginAtZero: true,
          },
        },
      },
    });

    // Step 4: Render the chart
    myChart.update();
   }

} catch (error) {
  console.log(error)
}
  


 }


 window.addEventListener('load', displayChart)
// config

// render init block

// Instantly assign Chart.js version
// const chartVersion = document.getElementById("chartVersion");
// chartVersion.innerText = Chart.version;

// Get the query parameter from the URL

// Get the query parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const messages = urlParams.get("message");

// Use the message as needed
// Output: User created

// Retrieve the username from Local Storage
const storedUsername = localStorage.getItem("username");

// Use the stored username as needed

const email = localStorage.getItem("email");
// logout
function loggingout() {
  window.location.href = "/signin.html";
}

