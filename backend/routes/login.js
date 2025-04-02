const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { users } = require('../models');

router.post('/', async (req, res) => {
	try {
		const user = await users.findById(req.body.username, 'password privEnc');
		if (!user) throw 400;

		if (!(await bcrypt.compare(req.body.password, user.password))) throw 403;
		
		// Sign JWT token with LOGIN_KEY stored on server
		const token = jwt.sign({ username: user._id }, process.env.LOGIN_KEY, { expiresIn: "15m" });

		// fetching the api key for user from ai service to send it to user
		let json;

		try {
			const response = await fetch(process.env.AI_URL + '/org/users', {
				method: 'POST',
				headers: { 
					'Authorization': `Bearer ${process.env.AI_API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username: user._id}),
			});

			json = await response.json();

			if (!response.ok) {
				return res.status(500).send({ 
					message: `The AI service sent the error: ${json.detail}`
				});
			}
		} catch (err) {
			return res.status(500).send({ 
				message: `Could not connect to the AI service`
			});
		}

		res.status(200).send({ 
			username: user._id, 
			token, 
			privEnc: user.privEnc,
			apiKey: json.apiKey,
		});
	} catch (e) {
		let code = 500, message = e.message;
		if (e == 400) { code = e, message = "User not found" }
		if (e == 403) { code = e, message = "Incorrect password" }
		res.status(code).send({ message });
	}
});

module.exports = router;