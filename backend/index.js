const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(express.json());

app.use('/api/register', require('./routes/register'));
app.use('/api/login', require('./routes/login'));
app.use('/api/chats', require('./routes/chats'));

(async () => {
	try {
		console.log("[+] Connecting to MongoDB Atlas...");
		await mongoose.connect(process.env.DB_URL);
		console.log("[+] Connection Successful");
		app.listen(5000, () => { console.log('[+] Server running on port 5000') });
	} catch (e) {
		console.log("[-] Connection Failed");
	}
})();