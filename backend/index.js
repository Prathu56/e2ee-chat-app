const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

app.use('/api/register', require('./routes/register'));
app.use('/api/login', require('./routes/login'));
app.use('/api/chats', require('./routes/chats'));
app.use('/api/helpers', require('./helpers'));

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: process.env.FRONTEND_URL,
		methods: ['GET', 'POST']
	}
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
	socket.on('assign_id', (username) => {
		socket.id = username;
		console.log("User " + socket.id + " connected")
	});

	socket.on('join_chat', (chatId) => {
		socket.join(chatId);
		console.log("User " + socket.id + " joined room " + chatId);
	});

	socket.on('send', (chatId) => {
		socket.to(chatId).emit('receive');
	})

	socket.on('leave_chat', (chatId) => {
		socket.leave(chatId);
		console.log("User " + socket.id + " left room " + chatId);
	});

	socket.on('disconnect', () => {
		console.log("User " + socket.id + " disconnected");
	});
});