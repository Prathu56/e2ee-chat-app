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
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------


// Generating key pairs for both users, and storing them as user.pub and user.priv
let bob = ecdhGenerate();

(async () => {
    // REGISTRATION //

    // A function for registration which takes in the username and password as parameters
    const register = async (username, password) => {
        // Generate ECDH key pair, creating user.pub and user.priv
        let user = ecdhGenerate();
        
        // Upload user's password's hash to the database
        user.password = await bcrypt.hash(password, 10);

        // Ecrypt user's private key using their password, and update user.priv
        user.priv = aesEncrypt(user.priv, password);

        // Create user's entry in database
        db.users[username] = user;
    };

    await register("alice", alicePass);
    await register("bob", bobPass);

    // REGISTRATION //

    console.log("The database after registration =", db);
})();
