import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const socketInstance = io(process.env.REACT_APP_BACKEND_URL);
		setSocket(socketInstance);

		return () => {
			socketInstance.disconnect();
		};
	}, []);

	return socket;
}