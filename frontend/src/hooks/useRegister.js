import { useState } from "react"
import { aesEncrypt, ecdhGenerate } from "../helpers/cryptography";

export const useRegister = () => {
	const [alertType, setAlertType] = useState(null); // changed
	const [alertMessage, setAlertMessage] = useState(null); // changed
	const [isLoading, setIsLoading] = useState(false);
	
	const register = async (username, password) => {
		setAlertType(null); // changed
		setAlertMessage(null); // changed
		setIsLoading(true);

		let { pub, priv } = await ecdhGenerate();
		const privEnc = aesEncrypt(priv, password);

		const response = await fetch('/api/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password, pub, privEnc })
		});

		const json = await response.json();

		if (!response.ok) {
			setAlertType('fail');
			setIsLoading(false);
		}
		if (response.ok) {
			setAlertType('success');
			setIsLoading(false);
		}
		setAlertMessage(json.message);
	};

	return { register, alertType, alertMessage, isLoading };
}