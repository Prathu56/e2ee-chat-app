import { AES, enc } from "crypto-js";

const aesEncrypt = (plainText, key) => {
	const cipherText = AES.encrypt(plainText, key).toString();
	return cipherText;
};

const aesDecrypt = (cipherText, key) => {
	const plainText = AES.decrypt(cipherText, key).toString(enc.Utf8);
	return plainText;
};

const ecdhGenerate = async () => {
	const keys = await window.crypto.subtle.generateKey(
		{ name: "ECDH", namedCurve: "P-256" }, true, ['deriveKey']
	);

	let pub = await window.crypto.subtle.exportKey('jwk', keys.publicKey);
	let priv = await window.crypto.subtle.exportKey('jwk', keys.privateKey);

	pub = btoa(JSON.stringify(pub));
	priv = btoa(JSON.stringify(priv));

	return { pub, priv };
};

const ecdhCompute = (privA, pubB) => {
	// const obj = createECDH('secp256k1');
	// obj.setPrivateKey(privA, 'base64');

	// const sharedKey = obj.computeSecret(pubB, 'base64', 'base64');
	// return sharedKey;
};


export { ecdhGenerate, ecdhCompute, aesEncrypt, aesDecrypt };