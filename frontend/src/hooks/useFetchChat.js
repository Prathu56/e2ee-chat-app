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

		let json;

		try {
			const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/chats/' + unameB, {
				method: 'GET',
				headers: { 'Authorization': `Bearer ${user.token}` }
			});
	
			json = await response.json();
	
			if (!response.ok) {
				setFetchError(json.message);
				return;
			}
		} catch (err) {
			setFetchError("Could not connect to the servers. Please try again");
			return;
		}
	
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
	};

	return { fetchChat, fetchError, setFetchError, messages, setMessages, chatId };
}