import { useState } from "react";
import { useSendMessage } from "../hooks/useSendMessage";
import { useAuthContext } from "../hooks/useAuthContext";
import { ecdhCompute } from "../helpers/cryptography";
import { useNavigate } from "react-router-dom";

const MessageModal = ({ isVisible, onClose }) => {
	const [username, setUsername] = useState('');
	const [message, setMessage] = useState('');
	const { user } = useAuthContext();
	const {
		sendMessage, error, isLoading,
		setError, setIsLoading
	} = useSendMessage();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/helpers/get-pub/' + username, {
			method: 'GET',
			headers: { 'Authorization': `Bearer ${user.token}` }
		});

		const json = await response.json();

		if (!response.ok) {
			setError(json.message);
			setIsLoading(false);
		}
		if (response.ok) {
			// Compute the shared key
			const sharedKey = await ecdhCompute(user.priv, json.pub);

			await sendMessage(username, sharedKey, message);
			setIsLoading(false);
			navigate('/chats/' + username, { replace: true });
		}
	};

	const handleClose = (e) => {
		if (e.target.id === "wrapper") onClose();
	};

	if (!isVisible) return null;

	return (
		<div
			id="wrapper"
			className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
			onClick={handleClose}>
			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-gray-100 p-5 rounded-2xl">
				<form className="space-y-6"
					onSubmit={handleSubmit}
				>
					<div>
						<label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
							Username
						</label>
						<div className="mt-2">
							<input
								id="username"
								name="username"
								type="text"
								onChange={(e) => setUsername(e.target.value)}
								value={username}
								autoComplete="username"
								required
								className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>

					<div>
						<div className="flex items-center justify-between">
							<label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
								Message
							</label>
							<div className="text-sm">
							</div>
						</div>
						<div className="mt-2">
							<input
								id="message"
								name="message"
								type="text"
								onChange={(e) => setMessage(e.target.value)}
								value={message}
								autoComplete="current-password"
								required
								className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>

					<div>
						<button
							disabled={isLoading}
							type="submit"
							className="flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
						>
							{isLoading ? "Sending..." : "Send"}
						</button>
					</div>
				</form>


				{error && (
					<div className="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
						{error}
					</div>
				)}
			</div>
		</div>
	)
};

export default MessageModal;