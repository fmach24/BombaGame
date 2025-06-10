const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const players = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  players[socket.id] = { x: 100, y: 100 };

  // Czekamy, aż klient powie, że gotowy
  socket.on("readyForPlayers", (data) => {
    players[socket.id] = { x: 100, y: 100, nick: data?.nick || "Gracz" };
    socket.emit("currentPlayers", players);
    socket.broadcast.emit("newPlayer", { id: socket.id, x: 100, y: 100, nick: players[socket.id].nick });
  });


  // Movement updates
  socket.on("playerMovement", (movementData) => {
    if (players[socket.id]) {
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;
      socket.broadcast.emit("playerMoved", { id: socket.id, x: movementData.x, y: movementData.y });
    }
  });

  // Player disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
  });
});

// server.listen(3000, () => {
//   console.log("Server listening on http://localhost:3000");
// });

server.listen(3000, '0.0.0.0', () => {
  console.log("Server listening on http://0.0.0.0:3000");
});

//namoim hotspocie 192.168.101.192:3000