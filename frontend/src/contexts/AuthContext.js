import { createContext, useEffect, useReducer } from 'react';
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
		try {
			const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/helpers/verify', {
				headers: { 'Authorization': `Bearer ${payload.token}` }
			});
	
			if (!response.ok) {
				dispatch({ type: 'LOGOUT' });
				return;
			}

			dispatch({ type: 'LOGIN', payload });
		} catch (err) {
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