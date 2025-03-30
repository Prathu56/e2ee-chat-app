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

		var format = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
		if (format.test(username)) {
			setAlertType('fail');
			setAlertMessage("Special characters, including spaces, not allowed in the username");
			setIsLoading(false);
			return;
		}

		let pubPrivObj;

		try {
			pubPrivObj = await ecdhGenerate();
		} catch (err) {
			setAlertType('fail');
			setAlertMessage("Could not generate shared key. Please try again");
			setIsLoading(false);
			return;
		}

		const { pub, priv } = pubPrivObj;
		const privEnc = aesEncrypt(priv, password);

		try {
			const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password, pub, privEnc })
			});
	
			const json = await response.json();
	
			if (!response.ok) {
				setAlertType('fail');
				setAlertMessage(json.message);
				setIsLoading(false);
				return;
			}

			setAlertType('success');
			setAlertMessage(json.message);
			setIsLoading(false);
		} catch (err) {
			setAlertType('fail');
			setAlertMessage("Could not connect to the servers. Please try again");
			setIsLoading(false);
		}
	};

	return { register, alertType, alertMessage, isLoading };
}