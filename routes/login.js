const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { getDb } = require('../helpers/mongoUtil');
const { aesDecrypt } = require('../helpers/cryptography');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const users = getDb().collection('users');
        const user = await users.findOne({ _id: req.body.username }, 
            { projection: { password: 1, privEnc: 1 }});
        if (!user) throw 400;

        if (await bcrypt.compare(req.body.password, user.password)) {
            // Sign JWT token with LOGIN_KEY stored on server
            const token = jwt.sign({ username: user._id }, process.env.LOGIN_KEY, { expiresIn: "15m" });

            // Decrypt the encrypted private key stored in the database
            const priv = aesDecrypt(user.privEnc, req.body.password);

            res.status(200).send({ username: user._id, token, priv });
        } else throw 403;
    } catch (e) {
        let code = 500, message = e.message;
        if (e == 400) { code = e, message = "User not found" }
        if (e == 403) { code = e, message = "Incorrect password" }
        res.status(code).send(message);
    }
});

module.exports = router;