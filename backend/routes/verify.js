const express = require('express');
const router = express.Router();
const auth = require('../helpers/auth');

router.get('/', auth, async (req, res) => {
	res.status(200).send({message: "JWT Verified"});
});

module.exports = router;