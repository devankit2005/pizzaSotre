import axios from "axios";
import Noty from "noty";
import { initAdmin } from "./admin";
import moment from "moment";
//import { initStripe } from "./stripe";

let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.getElementById("cart-counter");

const updateCart = async (pizza) => {
  try {
    const res = await axios.post("/update-cart", pizza);
    console.log(res.data.totalQty);
    cartCounter.innerText = res.data.totalQty;
    //toaster("Add in cart successfully.", "success");
  } catch (error) {
    //toaster("Something want wrong error", "error");
  }
};

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
  });
});

// Remove alert message after X seconds
const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

// Change order status
let statuses = document.querySelectorAll(".status_line");
let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement("small");

function updateStatus(order) {
  statuses.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current");
  });
  let stepCompleted = true;
  statuses.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add("step-completed");
    }

    if (dataProp === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current");
      }
    }
  });
}

updateStatus(order);
let socket = io();

// join
const adminAreaPath = window.location.pathname;

if (adminAreaPath.includes("admin")) {
  initAdmin(socket);
  socket.emit("join", "adminRoom");
}

if (order) {
  socket.emit("join", `order_${order._id}`);
}

socket.on("orderUpdated", (data) => {
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
});
