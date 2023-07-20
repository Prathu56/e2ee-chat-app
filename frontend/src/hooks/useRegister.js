import { useState } from "react"

export const useRegister = () => {
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);

	const register = async (username, password) => {
		setError(null);

		const response = await fetch('/api/register', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({username, password})
		});

		const json = await response.json();

		if (!response.ok) { setMessage(null); setError(json.error); }
		if (response.ok) { setError(null); setMessage(json.message); }
	};

	return { register, error, message };
};