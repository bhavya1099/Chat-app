const express = require("express"); //1
const http = require("http");
const app = express();
const socketTemplate = require("socket.io").Server; //works only when http is used
//http server
const nodeServer = http.createServer(app);
// socket server
const socketServer = new socketTemplate(nodeServer);
app.use(express.static("publicFolder")); //public folder will contain all the files that client wants to access from server.(static files and assets)

let room;
socketServer.on("connection", (socket) => {
  //whenever a new connection is established it will console log
  console.log("New Connection", socket.id);
  // setInterval(() => {
  //   socket.emit("message", `welcome to the chat ${socket.id}`);
  // }, 1000);
  socket.on("disconnect", () => {
    console.log("it is disconnected", socket.id);
  });

  socket.on("message", (data) => {
    console.log("message from client", data);
    socket.broadcast.emit("broadCastMessage", data);
  });

  socket.on("private", ({ message, recieverSocket }) => {
    console.log("message", message);
    socket.broadcast.to(recieverSocket).emit("personal", message);
  });

  socket.on("createGroup", function (groupId) {
    room = groupId;
    socket.join(room);
  });

  socket.on("joingroup", function () {
    console.log("you are added to group");
    socket.join(room);
  });

  socket.on("groupmessage", function (message) {
    socket.to(room).emit("serv_grp_message", message);
  });

  socket.on("leave", function (message) {
    console.log("user left the grp");
    socket.leave(room);
    socket.to(room).emit("user left the room", socket.id);
  });
});

//responds to http request
app.get("/", (req, res) => {
  res.send("<h1>Socket server</h1>");
});

nodeServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
