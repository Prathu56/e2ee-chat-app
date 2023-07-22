const express = require('express');
const router = express.Router();
const auth = require('./middleware/auth');
const { users } = require('./models');

router.get('/verify', auth, async (req, res) => {
	res.status(200).send({message: "JWT Verified"});
});

router.get('/get-pub/:username', auth, async (req, res) => {
	const user = await users.findById(req.params.username, 'pub').lean();
	if (!user) return res.status(404).send({ message: "User not found" });

	user.username = user._id; delete user._id;

	res.status(200).send(user);
});

module.exports = router;