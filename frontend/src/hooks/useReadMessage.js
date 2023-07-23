import { useState } from "react";
import { aesDecrypt } from "../helpers/cryptography";

export const useReadMessage = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const readMessage = async (sharedKey, message) => {
		setError(null);
		setIsLoading(true);

		// Decrypt the content
		let message = aesDecrypt(message, sharedKey);

		// Parse the JSON
		message = JSON.parse(message);

		return message;
	};

	return { readMessage, error, isLoading, setIsLoading };
}