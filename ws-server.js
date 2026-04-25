const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3001 });

// Cache the latest data so late joiners (like Staff opening the page later) can see it immediately
let latestPatientData = {};
let currentStatus = "waiting";

wss.on("connection", (ws) => {
  console.log("Client connected");
  
  // Send current state to newly connected client immediately
  ws.send(JSON.stringify({ type: "status", value: currentStatus, timestamp: Date.now() }));
  Object.keys(latestPatientData).forEach((field) => {
    ws.send(JSON.stringify({ type: "update", field, value: latestPatientData[field], timestamp: Date.now() }));
  });
  
  ws.on("message", (message) => {
    const dataString = message.toString();
    console.log("Received:", dataString);
    
    try {
      const parsed = JSON.parse(dataString);
      if (parsed.type === "update") {
        latestPatientData[parsed.field] = parsed.value;
      } else if (parsed.type === "status") {
        currentStatus = parsed.value;
        if (currentStatus === "waiting") {
          latestPatientData = {}; // Clear cache on reset
        }
      }
    } catch (e) {
      console.error("Failed to parse message in server:", e);
    }
    
    // broadcast ให้ทุก client
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(dataString);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on ws://localhost:3001");
