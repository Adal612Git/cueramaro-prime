// Guardar como test-websocket.js
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:9777');
ws.on('open', () => console.log('✅ Conectado al Device Mock'));
ws.on('message', (data) => console.log('📦 Datos recibidos:', data.toString()));
ws.on('error', (err) => console.log('❌ Error:', err.message));
