import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { aesDecrypt, ecdhCompute } from "../helpers/cryptography";

export const useFetchChat = () => {
	const [fetchError, setFetchError] = useState(null);
	const [messages, setMessages] = useState([]);
	const { user } = useAuthContext();

	const fetchChat = async (sharedKey, unameB) => {
		setMessages([]); setFetchError(null);

		const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/chats/' + unameB, {
			method: 'GET',
			headers: { 'Authorization': `Bearer ${user.token}` }
		});

		let json = await response.json();

		if (!response.ok) {
			setFetchError(json.message);
		}

		if (response.ok) {
			for (let i = 0; i < json.length; i++) {
				// Decrypt message
				let message = aesDecrypt(json[i], sharedKey);

				// Parse JSON
				message = JSON.parse(message);

				// If message from logged in user, ...
				message.from = (message.from === user.username) ? "You" : message.from;

				json[i] = message;
			}
			setMessages(json);
		}
	};

	return { fetchChat, fetchError, messages };
}