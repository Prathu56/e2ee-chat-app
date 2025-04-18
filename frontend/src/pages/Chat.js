import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { ecdhCompute } from "../helpers/cryptography";
import { useFetchChat } from "../hooks/useFetchChat";
import { useSendMessage } from "../hooks/useSendMessage";
import { useRef } from 'react';
import io from 'socket.io-client';
import { useFetchLastMessage } from "../hooks/useFetchLastMessage";

const Chat = () => {
	let { username } = useParams();
	const navigate = useNavigate();
	const bottomMost = useRef(null);
	const [sharedKey, setSharedKey] = useState(null);
	const [message, setMessage] = useState('');
	const [unameB, setUnameB] = useState(null);
	const { fetchChat, fetchError, setFetchError, messages, setMessages, chatId } = useFetchChat();
	const { sendMessage, error, isLoading } = useSendMessage();
	const { fetchLastMessage, fetchLastMessageError } = useFetchLastMessage();
	const { user } = useAuthContext();
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		if (username === "Notes") setUnameB(user.username);
		else setUnameB(username);

		const socketInstance = io(process.env.REACT_APP_FRONTEND_URL, {
			path: "/socket.io/",
		});
		setSocket(socketInstance);

		return () => {
			socketInstance.disconnect();
		};
	}, [])

	useEffect(() => {
		(async () => {
			if (!unameB) return;

			setFetchError(null);
			let json;

			try {
				const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/helpers/get-pub/' + unameB, {
					method: 'GET',
					headers: { 'Authorization': `Bearer ${user.token}` }
				});

				json = await response.json();

				if (!response.ok) {
					navigate('/', { replace: true });
					return;
				}
			} catch (err) {
				setFetchError("Could not connect to the servers. Please try again");
				return;
			}

			let sharedKey;

			try {
				sharedKey = await ecdhCompute(user.priv, json.pub);
			} catch (err) {
				setFetchError("Could not compute shared key. Please try again");
				return;
			}

			setSharedKey(sharedKey);
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
		if (chatId) {
			socket.emit('join_chat', chatId);
		}
	}, [chatId]);

	useEffect(() => {
		if (chatId) {
			const handleReceive = async () => {
				const lastMessage = await fetchLastMessage(sharedKey, chatId);
				setMessages((prevMessages) => [...prevMessages, lastMessage]);
				setTimeout(() => bottomMost.current.scrollIntoView(), 0); // Workaround for scroll to bottom
			};
	
			socket.on("receive", handleReceive);
	
			// Cleanup listener when component unmounts or dependencies change
			return () => {
				socket.off("receive", handleReceive);
			};
		}
	}, [chatId, fetchLastMessage, sharedKey, socket, bottomMost]);
	

	const handleClick = async (e) => {
		const ok = await sendMessage(unameB, sharedKey, message);
		setMessage('');
		
		if (ok) {
			const lastMessage = await fetchLastMessage(sharedKey, chatId);
			setMessages([...messages, lastMessage]);
			socket.emit('send', chatId);
		}
		
		setTimeout(() => bottomMost.current.scrollIntoView(), 0); // Workaround for scroll to bottom
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
					let youPClassName = "text-gray-100 whitespace-normal py-2 px-3 bg-cyan-600 rounded-lg max-w-xl";
					let PClassName = "whitespace-normal py-2 px-3 bg-gray-300 rounded-lg max-w-xl";

					let content = message.content;

					if (Array.isArray(content)) { // meaning, spam and/or phishing
						let newContent = "["

						if (content[0]) {
							newContent += "Spam";
						}

						if (content[1]) {
							if (newContent !== "[") newContent += " and ";
							newContent += "Phishing";
						}

						newContent += " Detected]";
						
						// now setting all the variables as needed
						content = newContent;
						youPClassName = "whitespace-normal py-2 px-3 bg-red-600 text-gray-100 rounded-lg max-w-xl";
						PClassName = "whitespace-normal py-2 px-3 bg-red-600 text-gray-100 rounded-lg max-w-xl";
					}

					if (message.from === "You") return (
						<li key={message.at}
							className='flex flex-col px-3 pt-5 items-end'>
							<p className={youPClassName}>
								{content}
							</p>
							<p className="text-gray-400">
								{new Date(message.at).toLocaleString()}
							</p>
						</li>
					)
					else return (
						<li key={message.at}
							className='flex flex-col px-3 pt-5 items-start'>
							<p className={PClassName}>
								{content}
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

			{fetchLastMessageError && (
				<div className="p-4 my-4 text- text-yellow-800 rounded-lg bg-yellow-100 m-14 text-center" role="alert">
					{fetchLastMessageError}
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