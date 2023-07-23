import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const Chat = () => {
	let { unameB } = useParams();
	const navigate = useNavigate();
	const [pub, setPub] = useState(null);
	const [message, setMessage] = useState('');
	const { user } = useAuthContext();

	useEffect(() => {
		(async () => {
			if (unameB !== "Notes") {
				const response = await fetch('/api/helpers/get-pub/' + unameB, {
					method: 'GET',
					headers: { 'Authorization': `Bearer ${user.token}` }
				});

				let json = await response.json();

				if (!response.ok) {
					alert(json.message);
					navigate('/', { replace: true });
				}

				if (response.ok) {
					setPub(json.pub);
				}
			}
		})();
	}, [])

	return (
		<>
			<div className="fixed z-90 bg-cyan-700 mx-auto w-screen flex flex-row justify-center p-3">
				<div className="justify-center items-center bg-gray-100 border-0 focus:outline-none rounded text-base px-2 font-semibold text-gray-700 truncate">
					{unameB}
				</div>
			</div>

			<div className="fixed z-90 bottom-0 bg-cyan-700 mx-auto w-screen flex flex-row items-center px-10 py-3">
				<input
					id="message"
					name="message"
					type="text"
					onChange={(e) => setMessage(e.target.value)}
					value={message}
					className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
				/>

				<button disabled={message == ''}
					className="justify-center items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mx-2 sm:ml-16 font-semibold disabled:bg-gray-200"
				>
					Send
				</button>
			</div>
		</>
	)
}

export default Chat;