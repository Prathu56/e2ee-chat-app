import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { aesDecrypt, ecdhCompute } from "../helpers/cryptography";

export const useFetchMessages = () => {
	const [error, setError] = useState(null);
	const [messages, setMessages] = useState([]);
	const { user } = useAuthContext();

	const fetchMessages = async () => {
		setMessages([]); setError(null);

		let json;

		try {
			const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/chats', {
				method: 'GET',
				headers: { 'Authorization': `Bearer ${user.token}`}
			});
	
			json = await response.json();
			
			if (!response.ok) {
				setError(json.message);
				return;
			}
		} catch (err) {
			setError("Could not connect to the servers. Please try again");
			return;
		}
	
		for (let i=0;i<json.length;i++) {
			// Compute shared key
			let sharedKey;

			try {
				sharedKey = await ecdhCompute(user.priv, json[i].pub);
			} catch (err) {
				setError("Could not compute shared key. Please try again");
				return;
			}

			// Decrypt message
			let message = aesDecrypt(json[i].message, sharedKey);

			// Parse JSON
			message = JSON.parse(message);

			// If message from logged in user, ...
			message.from = (message.from === user.username) ? "You" : message.from;

			json[i] = { 
				// If chat with self, ...
				with: (json[i].with === user.username) ? "Notes" : json[i].with, 
				...message}
		}
		setMessages(json);
	};

	return { fetchMessages, error, messages };
}