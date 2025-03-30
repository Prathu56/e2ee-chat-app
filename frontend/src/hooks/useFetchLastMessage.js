import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { aesDecrypt } from "../helpers/cryptography";

export const useFetchLastMessage = () => {
	const [fetchLastMessageError, setFetchLastMessageError] = useState(null);
	const { user } = useAuthContext();

	const fetchLastMessage = async (sharedKey, chatId) => {
		setFetchLastMessageError(null);

		let json;

		try {
			const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/chats/last/' + chatId, {
				method: 'GET',
				headers: { 'Authorization': `Bearer ${user.token}` }
			});
	
			json = await response.json();
	
			if (!response.ok) {
				setFetchLastMessageError(json.message);
				return;
			}
		} catch (err) {
			setFetchLastMessageError("Could not connect to the servers. Please try again");
			return;
		}
	
		// Decrypt message
		let message = aesDecrypt(json.messages[0], sharedKey);

		// Parse JSON
		message = JSON.parse(message);

		// If message from logged in user, ...
		message.from = (message.from === user.username) ? "You" : message.from;

		return message;
	};

	return { fetchLastMessage, fetchLastMessageError };
}