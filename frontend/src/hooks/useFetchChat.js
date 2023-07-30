import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { aesDecrypt } from "../helpers/cryptography";

export const useFetchChat = () => {
	const [fetchError, setFetchError] = useState(null);
	const [messages, setMessages] = useState([]);
	const [chatId, setChatId] = useState(null);
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
			for (let i = 0; i < json.messages.length; i++) {
				// Decrypt message
				let message = aesDecrypt(json.messages[i], sharedKey);

				// Parse JSON
				message = JSON.parse(message);

				// If message from logged in user, ...
				message.from = (message.from === user.username) ? "You" : message.from;

				json.messages[i] = message;
			}
			setMessages(json.messages);
			setChatId(json._id);
		}
	};

	return { fetchChat, fetchError, messages, chatId };
}