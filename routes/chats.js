const express = require('express');
const bcrypt = require('bcrypt');
const auth = require('../helpers/auth');
const { getDb } = require('../helpers/mongoUtil');
const { aesEncrypt, ecdhCompute } = require('../helpers/cryptography');
const router = express.Router();

router.post('/:username', auth, async (req, res) => {
    try {
        const unameA = req.user.username;
        const unameB = req.params.username;
        if (unameA == unameB) throw 403;

        const users = getDb().collection('users');
        const userB = await users.findOne({ _id: unameB }, { projection: { pub: 1, chats: 1 }});
        if (!userB) throw 404;
        
        const chats = getDb().collection('chats'); let chat;

        if (!(unameA in userB.chats)) { // No chat initiated before, initiating now
            chat = { users: [unameA, unameB], messages: [] };

            let result = await chats.insertOne(chat);

            // Create a new object under the users' chats as { username: chatId }
            await users.updateOne({ _id: unameB }, { $set: { ['chats.' + unameA]: result.insertedId }});
            await users.updateOne({ _id: unameA }, { $set: { ['chats.' + unameB]: result.insertedId }});
            
            // Update userB object
            userB.chats[unameA] = result.insertedId;
        }

        // Let's create a messageObj with 'from' and 'content', as a string
        const messageObj = JSON.stringify({ from: unameA, content: req.body.message });

        // Compute the shared key
        const sharedKey = ecdhCompute(req.body.priv, userB.pub);

        // Now use this shared key to encrypt the messageObj
        const encMessage = aesEncrypt(messageObj, sharedKey);
    
        // Upload this encrypted message to the database
        await chats.updateOne({ _id: userB.chats[unameA] }, { $push: { messages: encMessage }})
        // db.chats.alicebob.messages.push(encMessage);

        res.status(200).send("Message sent to " + unameB);
    } catch (e) {
        let code = 500, message = e.message;
        if (e == 403) { code = e, message = "Cannot send a message to self" }
        if (e == 404) { code = e, message = "User not found" }
        res.status(code).send(message);
    }
});

module.exports = router;