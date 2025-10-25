import { WebSocketServer } from "ws";

const PORT = 9777;
const wss = new WebSocketServer({ port: PORT });

console.log("[device-mock] ✅ WebSocket server en ws://localhost:" + PORT);

function rand() {
    return (Math.random() * 5 + 0.5).toFixed(3);
}

setInterval(() => {
    const msg = JSON.stringify({
        type: "peso",
        kg: Number(rand()),
        ts: Date.now()
    });
    
    wss.clients.forEach(client => {
        try {
            if (client.readyState === 1) {
                client.send(msg);
            }
        } catch (error) {
            // Ignorar errores
        }
    });
}, 1000);

wss.on('connection', (ws) => {
    console.log('[device-mock] 📡 Cliente conectado');
    ws.on('close', () => console.log('[device-mock] 📡 Cliente desconectado'));
});
