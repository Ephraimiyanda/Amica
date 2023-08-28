const notifica = document.querySelector("#notifications");
if (selectedRow !== null) {
  const newnotification = document.createElement("div");

  newnotification.innerHTML = ` 
 <div class="notification">
            <p>you updated</p>
            <img src="/images/akar-icons_circle-alert.png" alt="">
        </div>

`;
  notifica.prepend(newnotification);
}
