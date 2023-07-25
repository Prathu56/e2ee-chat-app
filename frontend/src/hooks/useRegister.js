import { useState } from "react"
import { aesEncrypt, ecdhGenerate } from "../helpers/cryptography";

export const useRegister = () => {
	const [alertType, setAlertType] = useState(null);
	const [alertMessage, setAlertMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	
	const register = async (username, password) => {
		setAlertType(null);
		setAlertMessage(null);
		setIsLoading(true);

		let { pub, priv } = await ecdhGenerate();
		const privEnc = aesEncrypt(priv, password);

		const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/register', {
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