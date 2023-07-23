import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { aesDecrypt, ecdhCompute } from "../helpers/cryptography";

export const useFetchMessages = () => {
	const [error, setError] = useState(null);
	const [messages, setMessages] = useState([]);
	const { user } = useAuthContext();

	const fetchMessages = async () => {
		setMessages([]); setError(null);

		const response = await fetch('/api/chats', {
			method: 'GET',
			headers: { 'Authorization': `Bearer ${user.token}`}
		});

		let json = await response.json();
		
		if (!response.ok) {
			setError(json.message);
		}

		if (response.ok) {
			for (let i=0;i<json.length;i++) {
				const sharedKey = await ecdhCompute(user.priv, json[i].pub);
				let message = aesDecrypt(json[i].message, sharedKey);
				message = JSON.parse(message);
				message.from = (message.from === user.username) ? "You" : message.from;
				json[i] = { 
					with: (json[i].with === user.username) ? "Notes" : json[i].with, 
					...message}
			}
			setMessages(json);
		}
	};

	return { fetchMessages, error, messages };
}