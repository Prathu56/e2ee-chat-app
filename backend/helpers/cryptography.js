const crypto = require('crypto');
const CryptoJS = require("crypto-js");

const aesEncrypt = (plainText, key) => {
    const cipherText = CryptoJS.AES.encrypt(plainText, key).toString();
    return cipherText;
};

const aesDecrypt = (cipherText, key) => {
    const plainText = CryptoJS.AES.decrypt(cipherText, key).toString(CryptoJS.enc.Utf8);
    return plainText;
};

const ecdhGenerate = () => {
    const obj = crypto.createECDH('secp256k1');
    obj.generateKeys();

    const pub = obj.getPublicKey().toString('base64');
    const priv = obj.getPrivateKey().toString('base64');

    return { pub, priv };
};

const ecdhCompute = (privA, pubB) => {
    const obj = crypto.createECDH('secp256k1');
    obj.setPrivateKey(privA, 'base64');

    const sharedKey = obj.computeSecret(pubB, 'base64', 'base64');
    return sharedKey;
};


module.exports = { ecdhGenerate, ecdhCompute, aesEncrypt, aesDecrypt };