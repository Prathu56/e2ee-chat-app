import { useState } from "react"
import { useAuthContext } from "./useAuthContext";
import { useSocket } from './useSocket';
import { aesDecrypt } from "../helpers/cryptography";

export const useLogin = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { dispatch } = useAuthContext();
	const socket = useSocket();

	const login = async (username, password) => {
		setError(null); setIsLoading(true);

		const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});

		const json = await response.json();

		if (!response.ok) {
			setError(json.message);
			setIsLoading(false);
		}
		if (response.ok) {
			// Decrypt privEnc using password, assign value to JSON
			json.priv = aesDecrypt(json.privEnc, password); delete json.privEnc;

			// socket.emit('assign_id', json.username);

			dispatch({ type: 'LOGIN', payload: json });
			setIsLoading(false);
		}
	};

	return { login, error, isLoading };
}