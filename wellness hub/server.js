const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

const clients = {};

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "register") {
      clients[data.userId] = ws;
    }

    if (data.type === "offer" || data.type === "answer" || data.type === "candidate") {
      if (clients[data.to]) {
        clients[data.to].send(JSON.stringify(data));
      }
    }
  });

  ws.on("close", () => {
    Object.keys(clients).forEach((userId) => {
      if (clients[userId] === ws) {
        delete clients[userId];
      }
    });
  });
});

console.log("WebRTC signaling server running on ws://localhost:8080");
