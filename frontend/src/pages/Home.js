import { useState } from "react"
import MessageModal from "../components/MessageModal";

const people = [
	{
		name: 'Leslie Alexander',
		email: 'leslie.alexander@example.com',
		role: 'Co-Founder / CEO',
		imageUrl:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		lastSeen: '3h ago',
		lastSeenDateTime: '2023-01-23T13:23Z',
	},
	{
		name: 'Michael Foster',
		email: 'michael.foster@example.com',
		role: 'Co-Founder / CTO',
		imageUrl:
			'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		lastSeen: '3h ago',
		lastSeenDateTime: '2023-01-23T13:23Z',
	},
	{
		name: 'Dries Vincent',
		email: 'dries.vincent@example.com',
		role: 'Business Relations',
		imageUrl:
			'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		lastSeen: '3h ago',
		lastSeenDateTime: '2023-01-23T13:23Z',
	},
	{
		name: 'Lindsay Walton',
		email: 'lindsay.walton@example.com',
		role: 'Front-end Developer',
		imageUrl:
			'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		lastSeen: '3h ago',
		lastSeenDateTime: '2023-01-23T13:23Z',
	},
	{
		name: 'Courtney Henry',
		email: 'courtney.henry@example.com',
		role: 'Designer',
		imageUrl:
			'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		lastSeen: '3h ago',
		lastSeenDateTime: '2023-01-23T13:23Z',
	},
	{
		name: 'Tom Cook',
		email: 'tom.cook@example.com',
		role: 'Director of Product',
		imageUrl:
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		lastSeen: '3h ago',
		lastSeenDateTime: '2023-01-23T13:23Z',
	},
	{
		name: 'Tom Cook',
		email: 'tom.cook@example.com',
		role: 'Director of Product',
		imageUrl:
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		lastSeen: '3h ago',
		lastSeenDateTime: '2023-01-23T13:23Z',
	},
	{
		name: 'Tom Cook',
		email: 'tom.cook@example.com',
		role: 'Director of Product',
		imageUrl:
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		lastSeen: '3h ago',
		lastSeenDateTime: '2023-01-23T13:23Z',
	},
	{
		name: 'Tom Cook',
		email: 'tom.cook@example.com',
		role: 'Director of Product',
		imageUrl:
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		lastSeen: '3h ago',
		lastSeenDateTime: '2023-01-23T13:23Z',
	},
	{
		name: 'Tom Cook',
		email: 'tom.cook@example.com',
		role: 'Director of Product',
		imageUrl:
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		lastSeen: '3h ago',
		lastSeenDateTime: '2023-01-23T13:23Z',
	},
	{
		name: 'Tom Cook',
		email: 'tom.cook@example.com',
		role: 'Director of Product',
		imageUrl:
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		lastSeen: '3h ago',
		lastSeenDateTime: '2023-01-23T13:23Z',
	},
]

export default function Home() {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<ul className="flex flex-1 flex-col divide-y divide-gray-500 mx-auto">
				{people.map((person) => (
					<li key={person.email} className="flex justify-between gap-x-6 py-5 px-7">
						<div className="flex gap-x-4">
							<div className="min-w-0 flex-auto">
								<p className="font-semibold leading-6 text-gray-900">{person.name}</p>
								<p className="mt-3 truncate leading-5 text-gray-700">{person.email}</p>
							</div>
						</div>
						<div className="flex flex-col items-end">
							<p className="leading-5 text-gray-400">
								<time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
							</p>
						</div>
					</li>
				))}
			</ul>

			<MessageModal isVisible={showModal} onClose={() => setShowModal(false)}/>

			<button
				onClick={() => setShowModal(!showModal)}
				className="fixed z-90 bottom-16 right-16 bg-cyan-600 w-16 h-16 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-cyan-700 hover:drop-shadow-2xl"
			>
				+
			</button>

		</>
	)
}
