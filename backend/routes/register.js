const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const bcrypt = require('bcrypt');
const { users } = require('../models');

router.post('/', async (req, res) => {
	const session = await mongoose.startSession(); 
    session.startTransaction(); 

	try {
		if (req.body.username == "You" || req.body.username == "Notes") throw 409;

		let user = {
			_id: req.body.username,
			password: await bcrypt.hash(req.body.password, 10), // hashed password
			pub: req.body.pub, privEnc: req.body.privEnc
		}

		// Create user's entry in database
		// passing in as array so it uses the session correctly
		user = await users.create([user], { session });

		// hitting the AI endpoint in case the user limit has been surpassed
		try {
			const response = await fetch(process.env.AI_URL + '/org/users', {
				method: 'POST',
				headers: { 
					'Authorization': `Bearer ${process.env.AI_API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username: user[0]._id}),
			});

			json = await response.json();

			if (!response.ok) {
				await session.abortTransaction();
				session.endSession();

				return res.status(500).send({ 
					message: `The AI service sent the error: ${json.detail}`
				});
			}
		} catch (err) {
			await session.abortTransaction();
			session.endSession();

			return res.status(500).send({ 
				message: `Could not connect to the AI service`
			});
		}

		// Initialize 'chats' key with an empty object
		await users.updateOne({ _id: user[0]._id }, { $set: { chats: {} } }, { session });

		await session.commitTransaction(); 
        session.endSession();

		const message = "Successfully registered as " + user[0]._id;
		res.status(201).send({message});
	} catch (e) {
		await session.abortTransaction();
		session.endSession();

		let code = 500, message = e.message;
		if (e == 409) { code = e; message = "Please use another username and try again" }
		if (e.code == 11000) { code = 409; message = "Username already in use" }
		res.status(code).send({message});
	}
});

module.exports = router;