const bcrypt = require('bcrypt');
const { aesEncrypt, aesDecrypt, ecdhGenerate, ecdhCompute } = require('./helpers/cryptography');
require('dotenv').config();

// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------
const message = "Kisiko mat batana thike?"; // The message to be sent //

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

    console.log("The database after registration =", db);

    // LOGIN //

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

    // LOGIN //

    
    // SENDING MESSAGE //
    
    // Assume Alice wants to Send a message to Bob, firstly she will login
    alice = await login("alice", alicePass);
    console.log("\nAlice's localStorage after login =", alice);

    // As no previous chats with Bob exist, she'll create an object on the database
    db.chats.alicebob = { users: ["alice", "bob"], messages: [] };

    // Compute the shared key with Bob using his public key
    let sharedKey = ecdhCompute(alice.priv, db.users.bob.pub);

    // Now use this shared key to encrypt the message
    let encMessage = aesEncrypt(message, sharedKey);

    // Upload this encrypted message to the database
    db.chats.alicebob.messages.push({
        from: 0, // Since Alice is at index 0 in the chats' users array
        content: encMessage
    });

    // Resetting so we don't use the previously generated readymade values
    alice = sharedKey = encMessage = undefined;
    
    // SENDING MESSAGE //

    console.log("\nAlice and Bob's chats object after sending the message =", db.chats.alicebob);

})();
