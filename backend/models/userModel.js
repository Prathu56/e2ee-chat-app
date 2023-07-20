const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	pub: { type: String, required: true },
	password: { type: String, required: true },
	privEnc: { type: String, required: true },
	chats: {} // type: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('users', userSchema);