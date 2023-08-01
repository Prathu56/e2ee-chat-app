import { useAuthContext } from "./useAuthContext";
import { useSocket } from "./useSocket";

export const useLogout = () => {
	const { dispatch } = useAuthContext();

	const logout = () => {
		// Dispatch logout action
		dispatch({type: 'LOGOUT'});
	};
	
	return { logout };
}