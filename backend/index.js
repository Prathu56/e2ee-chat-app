const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/chats', require('./routes/chats'));
app.use('/helpers', require('./helpers'));

const server = http.createServer(app);

const io = new Server(server, {
	path: "/socket.io/",
	cors: {
		origin: process.env.FRONTEND_URL,
		methods: ["GET", "POST"],
	},
});

(async () => {
	try {
		console.log("[+] Connecting to MongoDB Atlas...");
		await mongoose.connect(process.env.DB_URL);
		console.log("[+] Connection Successful");
		const port = process.env.PORT || 3000;
		server.listen(port, () => { console.log('[+] Server running on port ' + port) });
	} catch (e) {
		console.log("[-] Connection Failed");
	}
})();

io.on('connection', (socket) => {
	socket.on('join_chat', (chatId) => {
		socket.join(chatId);
		console.log("User " + socket.id + " joined room " + chatId);
	});

	socket.on('send', (chatId) => {
		socket.to(chatId).emit('receive');
		// socket.emit('receive');
		console.log("Message sent on " + chatId);
	});

	socket.on('disconnect', () => {
		console.log("User " + socket.id + " disconnected");
	});
});