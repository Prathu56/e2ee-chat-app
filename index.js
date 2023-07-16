const bcrypt = require('bcrypt');
const { aesEncrypt, aesDecrypt, ecdhGenerate, ecdhCompute } = require('./helpers/cryptography');
require('dotenv').config();

// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------
let message = "Kisiko mat batana thike?"; // The message to be sent //

// Passwords for both users
const alicePass = "AliceKaPasswordVerySecure#4#4";
const bobPass = "UskaPasswordKamjorHiHai5M#";

// Assume this as the database
// Assume key as the _id and value as the other fields of a document
let db = {users: {}, chats: {}};

// Assume these are the localStorage of both users
let alice, bob;
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

(async () => {
    // REGISTRATION //

    const register = async (username, password) => {
        // Generate ECDH key pair, creating user.pub and user.priv
        let user = ecdhGenerate();
        
        // Upload user's password's hash to the database
        user.password = await bcrypt.hash(password, 10);

        // Ecrypt user's private key using their password, and delete user.priv
        user.privEnc = aesEncrypt(user.priv, password); delete user.priv;

        // Create user's entry in database
        db.users[username] = user;
    };

    await register("alice", alicePass);
    await register("bob", bobPass);

    // REGISTRATION //
    console.log("\n---REGISTRATION---");
    console.log("Users collection after registration =", db.users);
    console.log("---REGISTRATION---");

    // LOGIN FUNCTION//

    const login = async (username, password) => {
        if (await bcrypt.compare(password, db.users[username].password)) {
            let localStorage = {};

            // Decrypt the encrypted private key stored in the database, and store it in localStorage
            localStorage.priv = aesDecrypt(db.users[username].privEnc, password);
            return localStorage;
        } else {
            console.log("Could not log in"); return;
        }
    };

    // LOGIN FUNCTION//

    
    // SENDING MESSAGE //

    console.log("\n\n---SENDING MESSAGE---");
    // Assume Alice wants to Send a message to Bob, firstly she will login
    alice = await login("alice", alicePass);
    console.log("Alice's localStorage after login =", alice);

    // As no previous chats with Bob exist, she'll create an object on the database
    db.chats.alicebob = { users: ["alice", "bob"], messages: [] };

    // Let's create a messageObj with 'from' and 'content', as a string
    let messageObj = JSON.stringify({ 
        from: 0, // Since Alice is at index 0 in the chats' users array
        content: message 
    });

    // Compute the shared key with Bob using his public key
    let sharedKey = ecdhCompute(alice.priv, db.users.bob.pub);

    // Now use this shared key to encrypt the messageObj
    let encMessage = aesEncrypt(messageObj, sharedKey);

    // Upload this encrypted message to the database
    db.chats.alicebob.messages.push(encMessage);

    // Resetting so we don't use the previously generated readymade values
    alice = sharedKey = encMessage = messageObj = message = undefined;
    
    // SENDING MESSAGE //

    console.log("\nChats collection after sending the message =", db.chats);
    console.log("---SENDING MESSAGE---");

    // READING MESSAGES //

    console.log("\n\n---READING MESSAGES---");

    const readMessages = (encKey) => {
        for (let i=0;i<db.chats.alicebob.messages.length;i++) {
            encMessage = db.chats.alicebob.messages[i];
    
            // Decrypt the message first using the shared key
            let decMessage = aesDecrypt(encMessage, encKey);
    
            // Parse the JSON
            decMessage = JSON.parse(decMessage);
    
            // Use the 'from' value to identify which user sent the message
            let from = db.chats.alicebob.users[decMessage.from];
    
            // Display the message nicely
            console.log(from + ": " + decMessage.content)
        }
    };
    
    // We can read the posted messages both as Alice and Bob
    // Since Bob is the recipient, let's read them as him first
    // To do that, firstly log in as Bob
    bob = await login("bob", bobPass);
    console.log("Bob's localStorage after login =", bob);

    // Compute the shared key as Bob
    sharedKey = ecdhCompute(bob.priv, db.users.alice.pub);

    // Now to read all the chats between Alice and Bob
    console.log("\nChat as read by Bob:");
    readMessages(sharedKey);

    // Resetting variables
    bob = sharedKey = undefined;

    // Now let's read the messages as Alice
    // First, log in as Alice
    alice = await login("alice", alicePass);
    console.log("\n\nAlice's localStorage after login =", alice);

    // Compute the shared key as Alice
    sharedKey = ecdhCompute(alice.priv, db.users.bob.pub);

    // Now to read all the chats between Alice and Bob
    console.log("\nChat as read by Alice:");
    readMessages(sharedKey);

    console.log("---READING MESSAGES---");
    
    // READING MESSAGES //
})();
