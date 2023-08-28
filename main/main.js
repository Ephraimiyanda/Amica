// pop up
const addItem = document.querySelector(".add");
const popup = document.querySelector(".popup-container");
const close = document.querySelector(".popup--close");
const form1 = document.querySelector(".popup");
const message = document.querySelector(".message");

addItem.addEventListener("click", () => {
  popup.classList.add("show--popup");
});
close.addEventListener("click", () => {
  popup.classList.remove("show--popup");
});

// form

let selectedRow = null;
form1.addEventListener("submit", (e) => {
  e.preventDefault();
});

const table = document.getElementById("item-list");

const tbody = table.getElementsByTagName("tbody")[0];

// Load data from localStorage
const savedData = JSON.parse(localStorage.getItem("mydata")) || [];
savedData.forEach((data) => {
  insertFormData(data);
});

function onFormSubmit() {
  if (validate()) {
    let formData = readFormData();
    if (selectedRow === null) {
      insertFormData(formData);
      message.textContent = "row inserted!";
      message.classList.add("message--display");

      setInterval(() => {
        message.classList.remove("message--display");
      }, 600);
    } else {
      updaterecord();
    }
    resetForm();
    popup.classList.remove("show--popup");

    // Save data to localStorage
    const savedData = JSON.parse(localStorage.getItem("mydata")) || [];
    savedData.push(formData);
    localStorage.setItem("mydata", JSON.stringify(savedData));
  }
}

function readFormData() {
  let formData = {};
  formData["stockname"] = document.getElementById("stock-name").value;
  formData["stocktype"] = document.getElementById("stock-type").value;
  formData["stockamount"] = document.getElementById("stock-amount").value;
  formData["stockprice"] = document.getElementById("stock-price").value;
  return formData;
}

function insertFormData(data) {
  let newRow = tbody.insertRow(tbody.length);

  cell1 = newRow.insertCell(0);
  cell1.innerHTML = data.stockname;
  cell2 = newRow.insertCell(1);
  cell2.innerHTML = data.stocktype;
  cell3 = newRow.insertCell(2);
  cell3.innerHTML = data.stockamount;
  cell4 = newRow.insertCell(3);
  cell4.innerHTML = data.stockprice;
  cell5 = newRow.insertCell(4);
  cell5.innerHTML = `<img onClick="onEdit(this)" src="/images/icons8-edit-20.png" alt="" class="popup--edit">`;
  cell6 = newRow.insertCell(5);
  cell6.innerHTML = `<img onClick="onDelete(this)" src="/images/Close_MD2.png" alt="" class="popup--close">`;
}

function resetForm() {
  document.getElementById("stock-name").value = "";
  document.getElementById("stock-type").value = "";
  document.getElementById("stock-amount").value = "";
  document.getElementById("stock-price").value = "";
  selectedRow = null;
}
function onEdit(td) {
  popup.classList.add("show--popup");
  selectedRow = td.parentElement.parentElement;
  document.getElementById("stock-name").value = selectedRow.cells[0].innerHTML;
  document.getElementById("stock-type").value = selectedRow.cells[1].innerHTML;
  document.getElementById("stock-amount").value =
    selectedRow.cells[2].innerHTML;
  document.getElementById("stock-price").value = selectedRow.cells[3].innerHTML;

  row = td.parentElement.parentElement;
  tbody.deleteRow(row.rowIndex - 1, 1);
  const savedData = JSON.parse(localStorage.getItem("mydata")) || [];
  savedData.splice(row.rowIndex - 0, 1);
  localStorage.setItem("mydata", JSON.stringify(savedData));
}
function updaterecord() {
  selectedRow.cells[0].innerHTML = document.getElementById("stock-name").value;
  selectedRow.cells[1].innerHTML = document.getElementById("stock-type").value;
  selectedRow.cells[2].innerHTML =
    document.getElementById("stock-amount").value;
  selectedRow.cells[3].innerHTML = document.getElementById("stock-price").value;
  let updatemessage = document.getElementById("stock-name").value;
  message.textContent = `${updatemessage} updated!`;
  message.classList.add("message--display");

  setInterval(() => {
    message.classList.remove("message--display");
  }, 600);
  // notifications
}

function onDelete(td) {
  if (confirm("Are you sure you want to delete this record?")) {
    row = td.parentElement.parentElement;
    tbody.deleteRow(row.rowIndex - 1, 1);
    resetForm();

    // Remove data from localStorage
    const savedData = JSON.parse(localStorage.getItem("mydata")) || [];
    savedData.splice(row.rowIndex - 0, 1);
    localStorage.setItem("mydata", JSON.stringify(savedData));
    message.textContent = "deleted";
    message.classList.add("message--display");

    setInterval(() => {
      message.classList.remove("message--display");
    }, 600);
  }
}

function validate() {
  isValid = true;
  if (document.getElementById("stock-name").value == "") {
    isValid = false;
    document.getElementById("fullNameValidationError").classList.remove("hide");
  } else {
    isValid = true;
    if (
      document
        .getElementById("fullNameValidationError")
        .classList.contains("hide")
    )
      document.getElementById("fullNameValidationError").classList.add("hide");
  }
  return isValid;
}

// notifications
// search
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#sreach");
  const tableBody = document.querySelector("#item-list tbody");

  const rows = Array.from(tableBody.getElementsByTagName("tr"));

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const escapedQuery = RegExp.escape(query);

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      let found = false;

      cells.forEach((cell) => {
        const value = cell.textContent.toLowerCase().replace(",", "");

        if (value.search(new RegExp(escapedQuery)) !== -1) {
          found = true;
        }
      });

      if (found) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});

// Polyfill for RegExp.escape() method
if (!RegExp.escape) {
  RegExp.escape = function (string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  };
}

// Consuming API
// Fetch all stocks
fetch('https://amica.onrender.com/stocks')
  .then(response => response.json())
  .then(data => {
    // Process the data (list of stocks) returned from the API
    console.log('All Stocks:', data);
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('Error fetching stocks:', error);
  });

// Add a new stock
const newStock = {
  name: 'New Stock',
  type: 'Type',
  quantity: 10,
  price: 100.0
};

fetch('https://amica.onrender.com/stocks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newStock)
})
  .then(response => {
    // Handle the response after adding the stock
    if (response.status === 201) {
      console.log('Stock added successfully');
    } else {
      console.error('Error adding stock');
    }
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('Error adding stock:', error);
  });
