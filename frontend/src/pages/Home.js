import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import MessageModal from "../components/MessageModal";
import { useFetchMessages } from "../hooks/useFetchMessages";

const Home = () => {
	const [showModal, setShowModal] = useState(false);
	const { fetchMessages, error, messages } = useFetchMessages();

	useEffect(() => {
		(async () => {
			await fetchMessages();
		})();
	}, [])

	return (
		<>
			{error && (
				<div className="p-4 my-4 text- text-yellow-800 rounded-lg bg-yellow-100 m-14 text-center" role="alert">
					{error}
				</div>
			)}

			<ul className="flex flex-1 flex-col divide-y divide-gray-500 mx-auto">
				{messages.map((message) => (
					<li key={message.with}>
						<Link to={'/chats/' + message.with}
							className='flex justify-between gap-x-6 py-5 px-7 bg-gray-100 hover:bg-gray-200'>
							<div className="flex gap-x-4 w-3/4">
								<div className="min-w-0 flex-auto">
									<p className="font-bold leading-6 text-gray-900 text-lg">{message.with}</p>
									<p className="mt-3 truncate leading-5 text-gray-700">
										{(message.from === "You") && <span className='font-semibold'>You: </span>}
										{message.content}
									</p>
								</div>
							</div>
							<div className="flex flex-col items-end">
								<p className="leading-5 text-gray-400">
									<TimeAgo date={message.at} />
								</p>
							</div>
						</Link>
					</li>
				))}
			</ul>

			<MessageModal isVisible={showModal} onClose={() => setShowModal(false)} />

			<button
				onClick={() => setShowModal(!showModal)}
				className="fixed z-90 bottom-16 right-16 bg-cyan-600 w-16 h-16 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-cyan-700 hover:drop-shadow-2xl"
			>
				+
			</button>

		</>
	)
}

export default Home;