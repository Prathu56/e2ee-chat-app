import { createContext, useEffect, useReducer } from 'react';
import { socket } from '../hooks/useSocket';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN':
			localStorage.setItem('user', JSON.stringify(action.payload));
			return { user: action.payload };
		case 'LOGOUT':
			localStorage.removeItem('user');
			return { user: null };
		default:
			return state;
	}
};

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, { user: null });

	const verifyJWT = async (payload) => {
		const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/helpers/verify', {
			headers: { 'Authorization': `Bearer ${payload.token}` }
		});

		if (response.ok) {
			socket.connect();
			socket.emit('assign_id', payload.username);
			dispatch({ type: 'LOGIN', payload });
		}
		if (!response.ok) {
			socket.disconnect();
			dispatch({ type: 'LOGOUT' });
		}
	}

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user'));
		if (user) verifyJWT(user);
	}, [])

	return (
		<AuthContext.Provider value={{ ...state, dispatch }}>
			{children}
		</AuthContext.Provider>
	)
};