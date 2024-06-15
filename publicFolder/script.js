console.log("I'm working!");
//connecting with the server from the client side, by calling this function connection will be triggered on the server side
const socket = io();
const sendBtn = document.querySelector(".send");
const msgInput = document.querySelector(".msg");
const messagesContainer = document.querySelector(".messages");
const grpBtn = document.getElementById("createGrp");
const joinGrp = document.getElementById("joinGrp");
const stg = document.getElementById("stg");
const leave = document.getElementById("leave");

sendBtn.addEventListener("click", function () {
  // add message to the UI
  if (msgInput.value === "") return;
  console.log("msg input value", msgInput.value);
  const sender = document.createElement("div");
  sender.setAttribute("class", "sender");
  sender.innerHTML = "You:" + msgInput.value;
  //send message to the server
  messagesContainer.appendChild(sender);
  socket.emit("message", msgInput.value);
  msgInput.value = "";
});

grpBtn.addEventListener("click", function () {
  // add message to the UI
  socket.emit("createGroup", Math.floor(Math.random(0, 1) * 1000));
});

joinGrp.addEventListener("click", function () {
  // add message to the UI
  socket.emit("joingroup");
});

stg.addEventListener("click", function () {
  // add message to the UI
  socket.emit("groupmessage", msgInput.value);
  msgInput.value = "";
});

leave.addEventListener("click", function () {
  socket.emit("leave");
});

socket.on("serv_grp_message", function (data) {
  const receiver = document.createElement("div");
  receiver.setAttribute("class", "receiver");
  receiver.innerHTML = "Sender:" + data;
  messagesContainer.appendChild(receiver);
});

socket.on("broadCastMessage", function (data) {
  const receiver = document.createElement("div");
  receiver.setAttribute("class", "receiver");
  receiver.innerHTML = "Sender:" + data;
  messagesContainer.appendChild(receiver);
});

/******private message ******/

const recieverSocket = document.querySelector(".recieverSocket");
const addSocketBtn = document.querySelector(".addSocket");

addSocketBtn.addEventListener("click", () => {
  if (msgInput.value === "") return;
  if (recieverSocket.value === "") return;
  socket.emit("private", {
    message: msgInput.value,
    recieverSocket: recieverSocket.value,
  });
  msgInput.value = "";
  recieverSocket.value = "";
});

socket.on("personal", function (data) {
  const receiver = document.createElement("div");
  receiver.setAttribute("class", "receiver");
  receiver.innerHTML = "Sender:" + data;
  messagesContainer.appendChild(receiver);
});

socket.on("message", (data) => {
  console.log("message from server", data);
});

/*****
 * 1. client
 *  "emit" -> to send data to server
 *  "on" -> to receive data from server
 * 2. server
 *  "on" -> to receive data from client
 *  "emit" -> to send data to events -> data will be send ->
 *  * broadcast
 *  * private message
 *  * group message
 * ****/
