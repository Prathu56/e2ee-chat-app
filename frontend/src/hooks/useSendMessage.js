import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { aesEncrypt, ecdhCompute } from "../helpers/cryptography"

export const useSendMessage = () => {
	const [alertType, setAlertType] = useState(null);
	const [alertMessage, setAlertMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuthContext();

	const sendMessage = async (priv, userB, content) => {
		setAlertType(null);
		setAlertMessage(null); 
		setIsLoading(true);

		// Let's create a messageObj with 'from' and 'content', as a string
		const messageObj = JSON.stringify({ from: user.username, content, at: new Date() });

		// Compute the shared key
		const sharedKey = await ecdhCompute(priv, userB.pub);
		console.log(sharedKey)

		// Now use this shared key to encrypt the messageObj
		const encMessage = aesEncrypt(messageObj, sharedKey);

		const response = await fetch('/api/chats/' + userB.username, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${user.token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ message: encMessage })
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

	return { 
		sendMessage, alertType, alertMessage, isLoading,
		setAlertType, setAlertMessage, setIsLoading
	};
}