const WebSocket = require("ws");

// Server setup
const wss = new WebSocket.Server({ port: 8080 });
let players = [];
let grid = Array(25)
  .fill(null)
  .map(() => Array(25).fill(" "));

// Broadcast to all players
function broadcast(data) {
  players.forEach((player) => player.send(JSON.stringify(data)));
}

// Handle connections
wss.on("connection", (ws) => {
  if (players.length >= 2) {
    ws.close();
    return;
  }

  players.push(ws);
  const player = players.length === 1 ? "0" : "X";
  ws.send(JSON.stringify({ type: "init", player }));

  if (players.length === 2) {
    broadcast({ type: "update", grid });
  }

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type === "move") {
      grid = data.grid;
      broadcast({ type: "update", grid });
    }
  });

  ws.on("close", () => {
    players = players.filter((player) => player !== ws);
    grid = Array(25)
      .fill(null)
      .map(() => Array(25).fill(" "));
    broadcast({ type: "update", grid });
  });
});

console.log("WebSocket server running on ws://localhost:8080");