// Pop up
const addItem = document.querySelector(".add");
const popup = document.querySelector(".popup-container");
const close = document.querySelector(".popup--close");
const form1 = document.querySelector(".popup");
const message = document.querySelector(".message");
const stockType = document.querySelector("#stock-type");
const stockAmount = document.getElementById("stock-amount");
const stockPrice = document.getElementById("stock-price");
const stockName = document.querySelector(".stock-name");
const userId=localStorage.getItem("user")

addItem.addEventListener("click", () => {
  popup.classList.add("show--popup");
});
close.addEventListener("click", () => {
  popup.classList.remove("show--popup");
});

// Form

let selectedRow = null;
form1.addEventListener("submit", (e) => {
  e.preventDefault();
  newProduct()
});

const table = document.getElementById("item-list");
const tbody = table.getElementsByTagName("tbody")[0];

// Load data from localStorage

function insertFormData(data) {
  data.forEach((stock) => {
    let newRow = tbody.insertRow(tbody.length);
    newRow.setAttribute('data-id', stock._id);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = stock.name;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = stock.type;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = stock.quantity;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = stock.price;
    cell5 = newRow.insertCell(4);
    cell5.innerHTML = `<img onClick="onEdit(this)" src="/images/icons8-edit-20.png" alt="" class="popup--edit">`;
    cell6 = newRow.insertCell(5);
    cell6.innerHTML = `<img onClick="onDelete(this)" src="/images/Close_MD2.png" alt="" class="popup--close">`;
  });
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
  const productId = selectedRow.getAttribute('data-id');
  const updatedData = readFormData();
  updateProduct(productId, updatedData);
  popup.classList.remove('show--popup');
}

const resetForm = () => {
  location.reload()
}

function onDelete(td) {
  const productId = td.parentElement.parentElement.getAttribute('data-id');
  if (confirm("Are you sure you want to delete this record?")) {
    deleteProduct(productId);
    row = td.parentElement.parentElement;
    tbody.deleteRow(row.rowIndex - 1, 1);

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

const deleteProduct = (productId) => {
  fetch(`https://amica-a.onrender.com/stocks/${productId}`, {
    method: 'DELETE'})
  .then(response => {
    if (response.ok) {
      console.log('Product deleted successfully');
      resetForm();
    }
  })
  .catch(error => {
    console.error('Error deleting product:', error);
  });
};

const updateProduct = (productId, updatedData) => {
  fetch(`https://amica-a.onrender.com/stocks/${productId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  })
  .then(response => {
    if (response.ok) {
      console.log('Product updated successfully');
      return response.json(); // Get the updated product data
    } else {
      console.error('Error updating product');
    }
  })
  .then(updatedProduct => {
    updateTableRow(productId, updatedProduct);
  })
  .catch(error => {
    console.error('Error updating product:', error);
  });
};

const updateTableRow = (productId, updatedProduct) => {
  const row = document.querySelector(`[data-id="${productId}"]`);
  if (row) {
    row.cells[0].innerHTML = updatedProduct.name;
    row.cells[1].innerHTML = updatedProduct.type;
    row.cells[2].innerHTML = updatedProduct.quantity;
    row.cells[3].innerHTML = updatedProduct.price;

    message.textContent = `${updatedProduct.name} updated!`;
    message.classList.add('message--display');

    setInterval(() => {
      message.classList.remove('message--display');
    }, 600);
  }
};

function validate() {
  isValid = true;
  if (document.querySelector(".stock-name").value == "") {
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

// Search functionality
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#search");
  const tableBody = document.querySelector("#item-list tbody");
  const rows = Array.from(tableBody.getElementsByTagName("tr"));

  // Fetch and insert data from API
  fetchDataAndInsert();
});

// Polyfill for RegExp.escape() method
if (!RegExp.escape) {
  RegExp.escape = function (string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  };
}

// Consume API and insert data
const fetchDataAndInsert = async () => {
  const getuserId = localStorage.getItem("user");
  const userId = JSON.parse(getuserId);
  try {
    const response = await fetch(`https://amica-a.onrender.com/stocks/${userId._id}/all`);
    const data = await response.json();

    if (Array.isArray(data)) {
      insertFormData(data);
      console.log('All Stocks:', data);
    }
  } catch (error) {
    console.error('Error fetching and inserting stocks:', error);
  }
};

// Add new stock to API
const newProduct = () => {
  const getuserId = localStorage.getItem("user");
  const userId = JSON.parse(getuserId);
  const newStock = {
    user:userId._id,
    name: stockName.value,
    type: stockType.value,
    quantity: parseInt(stockAmount.value),
    price: parseInt(stockPrice.value) 
  };

console.log(newStock);
  fetch(`https://amica-a.onrender.com/stocks/${userId._id}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newStock)
  })
  .then(response => {
    if (response.ok) {
      console.log('Stock added successfully');
      location.reload();
      return response.json(); // Get the added stock data
    } else {
      console.error('Error adding stock');
    }
  })
  .then(addedStock => {
    insertFormData([addedStock]);
  })
  .catch(error => {
    console.error('Error adding stock:', error);
  });
};
