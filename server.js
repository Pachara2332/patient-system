const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const WebSocket = require("ws");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

// ===== State Cache (เก็บข้อมูลล่าสุดให้คนที่เปิดจอทีหลังเห็นข้อมูลทันที) =====
let latestPatientData = {};
let currentStatus = "waiting";

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // ===== WebSocket Server (รันบน HTTP Server เดียวกับ Next.js) =====
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    // ส่ง State ที่ Cache ไว้ให้ Client ที่เพิ่งเชื่อมต่อเข้ามา
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
            latestPatientData = {};
          }
        }
      } catch (e) {
        console.error("Failed to parse message:", e);
      }

      // Broadcast ให้ทุก Client
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

  server.listen(port, () => {
    console.log(`> Server ready on http://localhost:${port}`);
    console.log(`> WebSocket ready on ws://localhost:${port}`);
  });
});
