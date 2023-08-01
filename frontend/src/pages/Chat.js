import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { ecdhCompute } from "../helpers/cryptography";
import { useFetchChat } from "../hooks/useFetchChat";
import { useSendMessage } from "../hooks/useSendMessage";
import { useSocket } from "../hooks/useSocket";
import { useRef } from 'react';

const Chat = () => {
	let { username } = useParams();
	const navigate = useNavigate();
	const bottomMost = useRef(null);
	const [sharedKey, setSharedKey] = useState(null);
	const [message, setMessage] = useState('');
	const [unameB, setUnameB] = useState(null);
	const { fetchChat, fetchError, messages, chatId } = useFetchChat();
	const { sendMessage, error, isLoading } = useSendMessage();
	const { user } = useAuthContext();
	const socket = useSocket();

	useEffect(() => {
		if (username === "Notes") setUnameB(user.username);
		else setUnameB(username);
	}, [])

	useEffect(() => {
		(async () => {
			if (unameB) {
				const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/helpers/get-pub/' + unameB, {
					method: 'GET',
					headers: { 'Authorization': `Bearer ${user.token}` }
				});

				let json = await response.json();

				if (!response.ok) navigate('/', { replace: true });
				if (response.ok) setSharedKey(await ecdhCompute(user.priv, json.pub));
			}
		})();
	}, [unameB]);

	useEffect(() => {
		(async () => {
			if (sharedKey) {
				await fetchChat(sharedKey, unameB);
				setTimeout(() => bottomMost.current.scrollIntoView(), 0); // Workaround for scroll to bottom
			}
		})();
	}, [sharedKey]);

	useEffect(() => {
		if (chatId) socket.emit('join_chat', chatId);
	}, [chatId]);

	useEffect(() => {
		console.log("Socket change observed")
	}, [socket])

	const handleClick = async (e) => {
		await sendMessage(unameB, sharedKey, message);
		setMessage('');
		await fetchChat(sharedKey, unameB);
		setTimeout(() => bottomMost.current.scrollIntoView(), 0); // Workaround for scroll to bottom
		socket.emit('send', chatId);
	}

	return (
		<>
			<div className="sticky z-90 bg-cyan-700 mx-auto flex flex-row justify-center p-3 top-20 sm:top-16 inset-y-0">
				<div className="justify-center items-center bg-gray-100 border-0 focus:outline-none rounded text-base px-2 font-semibold text-gray-700 truncate">
					{unameB}
				</div>
			</div>

			<ul className="flex flex-col">
				{messages.map((message) => {
					if (message.from === "You") return (
						<li key={message.at}
							className='flex flex-col px-3 pt-5 items-end'>
							<p className="text-gray-100 whitespace-normal py-2 px-3 bg-cyan-600 rounded-lg max-w-xl">
								{message.content}
							</p>
							<p className="text-gray-400">
								{new Date(message.at).toLocaleString()}
							</p>
						</li>
					)
					else return (
						<li key={message.at}
							className='flex flex-col px-3 pt-5 items-start'>
							<p className="whitespace-normal py-2 px-3 bg-gray-300 rounded-lg max-w-xl">
								{message.content}
							</p>
							<p className="text-gray-400">
								{new Date(message.at).toLocaleString()}
							</p>
						</li>
					)
				})}
			</ul>

			{fetchError && (
				<div className="p-4 my-4 text- text-yellow-800 rounded-lg bg-yellow-100 m-14 text-center" role="alert">
					{fetchError}
				</div>
			)}

			{error && (
				<div className="p-4 my-4 text- text-red-800 rounded-lg bg-red-100 m-14 text-center" role="alert">
					{error}
				</div>
			)}

			<div ref={bottomMost} className="p-7 mt-1.5"></div>

			<form className="fixed z-90 bottom-0 bg-cyan-700 mx-auto w-screen flex flex-row items-center px-3 sm:px-10 py-3">
				<input
					id="message"
					name="message"
					type="text"
					onChange={(e) => setMessage(e.target.value)}
					value={message}
					className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
				/>

				<button disabled={(message === '') || (isLoading)} onClick={handleClick}
					className="justify-center items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mx-2 sm:ml-8 font-semibold disabled:bg-gray-200 w-32"
				>
					{isLoading ? "Sending..." : "Send"}
				</button>
			</form>
		</>
	)
}

export default Chat;