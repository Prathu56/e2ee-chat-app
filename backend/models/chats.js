const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    messages: [String]
}, { timestamps: true });

module.exports = mongoose.model('chats', chatSchema);