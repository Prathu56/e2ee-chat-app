const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { users } = require('../models');
const { ecdhGenerate, aesEncrypt } = require('../helpers/cryptography');

router.post('/', async (req, res) => {
	try {
		if (req.body.username == "You" || req.body.username == "Notes") throw 409;
		let password = req.body.password;

		// Generate ECDH key pair, creating user.pub and user.priv
		let user = ecdhGenerate();

		// Set username
		user._id = req.body.username;

		// Upload user's password's hash to the database
		user.password = await bcrypt.hash(password, 10);

		// Ecrypt user's private key using their password, and delete user.priv
		user.privEnc = aesEncrypt(user.priv, password); delete user.priv;

		// Create user's entry in database
		user = await users.create(user);

		// Initialize 'chats' key with an empty object
		user.set({ chats: {} }); await user.save();

		const message = "Successfully registered as " + user._id;
		res.status(201).send({message});
	} catch (e) {
		let code = 500, message = e.message;
		if (e == 409) { code = e; message = "Please use another username and try again" }
		if (e.code == 11000) { code = 409; message = "Username already in use" }
		res.status(code).send({error: message});
	}
});

module.exports = router;