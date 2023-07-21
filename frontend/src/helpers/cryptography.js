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

	pub = JSON.stringify(pub);
	priv = JSON.stringify(priv);

	return { pub, priv };
};

const ecdhCompute = async (privA, pubB) => {
	let privKey = JSON.parse(privA);
	let pubKey = JSON.parse(pubB);

	privKey = await window.crypto.subtle.importKey(
		'jwk', privKey, { name: 'ECDH', namedCurve: 'P-256' },
		true, ['deriveKey']
	);

	pubKey = await window.crypto.subtle.importKey(
		'jwk', pubKey, { name: 'ECDH', namedCurve: 'P-256' },
		true, []
	);

	let sharedKey = await window.crypto.subtle.deriveKey(
		{ name: 'ECDH', public: pubKey },
		privKey,
		{ name: 'AES-CBC', length: 256 }, // Desired derived key algorithm and length
		true, ['encrypt', 'decrypt'] // Key usages for the derived key
	);

	sharedKey = await window.crypto.subtle.exportKey('raw', sharedKey);
	sharedKey = btoa(String.fromCharCode(...new Uint8Array(sharedKey)));

	return sharedKey

	// const obj = createECDH('secp256k1');
	// obj.setPrivateKey(privA, 'base64');

	// const sharedKey = obj.computeSecret(pubB, 'base64', 'base64');
	// return sharedKey;
};


export { ecdhGenerate, ecdhCompute, aesEncrypt, aesDecrypt };