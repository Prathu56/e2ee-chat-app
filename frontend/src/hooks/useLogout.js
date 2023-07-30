import { useAuthContext } from "./useAuthContext";
import { socket } from "./useSocket";

export const useLogout = () => {
	const { dispatch } = useAuthContext();

	const logout = () => {
		// Disconnect socket
		socket.disconnect();

		// Dispatch logout action
		dispatch({type: 'LOGOUT'});
	};
	
	return { logout };
}