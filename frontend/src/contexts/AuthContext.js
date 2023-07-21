import { createContext, useEffect, useReducer } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN':
			return { user: action.payload };
		case 'LOGOUT':
			return { user: null };
		default:
			return state;
	}
};

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, { user: null });

	const verifyJWT = async (payload) => {
		const response = await fetch('/api/verify', {
			headers: { 'Authorization': `Bearer ${payload.token}` }
		});

		if (response.ok) dispatch({ type: 'LOGIN', payload });
		else {
			localStorage.removeItem('user');
			dispatch({ type: 'LOGOUT' });
		}
	}

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user'));
		if (user) verifyJWT(user);
	}, [])

	console.log("AuthContext state:", state);

	return (
		<AuthContext.Provider value={{ ...state, dispatch }}>
			{children}
		</AuthContext.Provider>
	)
};