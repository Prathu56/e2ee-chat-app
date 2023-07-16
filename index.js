const express = require('express');
const { connect } = require('./helpers/mongoUtil');
require('dotenv').config();
const app = express();
app.use(express.json());

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/chats', require('./routes/chats'));

connect();

app.listen(3000, () => {
    console.log('Server running on port 3000')
});

// // READING MESSAGES //

// console.log("\n\n---READING MESSAGES---");

// const readMessages = (encKey) => {
//     for (let i=0;i<db.chats.alicebob.messages.length;i++) {
//         encMessage = db.chats.alicebob.messages[i];

//         // Decrypt the message first using the shared key
//         let decMessage = aesDecrypt(encMessage, encKey);

//         // Parse the JSON
//         decMessage = JSON.parse(decMessage);

//         // Use the 'from' value to identify which user sent the message
//         let from = db.chats.alicebob.users[decMessage.from];

//         // Display the message nicely
//         console.log(from + ": " + decMessage.content)
//     }
// };

// // We can read the posted messages both as Alice and Bob
// // Since Bob is the recipient, let's read them as him first
// // To do that, firstly log in as Bob
// bob = await login("bob", bobPass);
// console.log("Bob's localStorage after login =", bob);

// // Compute the shared key as Bob
// sharedKey = ecdhCompute(bob.priv, db.users.alice.pub);

// // Now to read all the chats between Alice and Bob
// console.log("\nChat as read by Bob:");
// readMessages(sharedKey);

// // Resetting variables
// bob = sharedKey = undefined;

// // Now let's read the messages as Alice
// // First, log in as Alice
// alice = await login("alice", alicePass);
// console.log("\n\nAlice's localStorage after login =", alice);

// // Compute the shared key as Alice
// sharedKey = ecdhCompute(alice.priv, db.users.bob.pub);

// // Now to read all the chats between Alice and Bob
// console.log("\nChat as read by Alice:");
// readMessages(sharedKey);

// console.log("---READING MESSAGES---");

// // READING MESSAGES //
