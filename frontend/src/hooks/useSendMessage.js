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

		// checking for spam or phishing
		const aiResponse = await fetch(process.env.REACT_APP_AI_URL + '/predict/spam-phishing', {
			method: 'POST',
			headers: {
				// 'Authorization': `Bearer ${user.token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text: content })
		});

		const aiJson = await aiResponse.json();

		if (!aiResponse.ok) {
			setError(aiJson.message);
			setIsLoading(false);
			return false;
		}
		
		let spamAndPhishing = [false, false];

		spamAndPhishing[0] = aiJson.spam;
		for (let url of aiJson.urls) {
			spamAndPhishing[1] = spamAndPhishing[1] || url.phishing;
			console.log(url);
			if (spamAndPhishing[1]) { break }
		}

		// if message found to be spam and/or phishing, change the content of the message
		if (spamAndPhishing[0] || spamAndPhishing[1]) {
			content = spamAndPhishing;
		}

		// Let's create a messageObj with 'from' and 'content', as a string
		const messageObj = JSON.stringify({ from: user.username, content, at: new Date() });

		// Now use this shared key to encrypt the messageObj
		const encMessage = aesEncrypt(messageObj, sharedKey);

		const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/chats/' + unameB, {
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
			return false;
		}
		
		setIsLoading(false);
		return true;
	};

	return { 
		sendMessage, error, isLoading,
		setError, setIsLoading
	};
}