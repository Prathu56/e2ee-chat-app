import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { aesEncrypt } from "../helpers/cryptography"

export const useSendMessage = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuthContext();

	const sendMessage = async (unameB, sharedKey, content) => {
		setError(null);
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
			setError(json.message);
			setIsLoading(false);
		}
		if (response.ok) {
			setIsLoading(false);
		}
	};

	return { 
		sendMessage, error, isLoading,
		setError, setIsLoading
	};
}