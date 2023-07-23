import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { aesEncrypt } from "../helpers/cryptography"

export const useSendMessage = () => {
	const [success, setSuccess] = useState(null);
	const [alertMessage, setAlertMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuthContext();

	const sendMessage = async (unameB, sharedKey, content) => {
		setSuccess(null);
		setAlertMessage(null); 
		setIsLoading(true);

		// Let's create a messageObj with 'from' and 'content', as a string
		const messageObj = JSON.stringify({ from: user.username, content, at: new Date() });

		// Now use this shared key to encrypt the messageObj
		const encMessage = aesEncrypt(messageObj, sharedKey);

		const response = await fetch('/api/chats/' + unameB, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${user.token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ message: encMessage })
		});

		const json = await response.json();

		if (!response.ok) {
			setSuccess(false);
			setIsLoading(false);
		}
		if (response.ok) {
			setSuccess(true);
			setIsLoading(false);
		}
		setAlertMessage(json.message);
	};

	return { 
		sendMessage, success, alertMessage, isLoading,
		setSuccess, setAlertMessage, setIsLoading
	};
}