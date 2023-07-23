import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Navbar from './components/Navbar';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
	const { user } = useAuthContext();

	return (
		<div className="App">
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path='/'
						element={user ? <Home /> : <Navigate to='/login' />}
					/>
					<Route path='/login'
						element={!user ? <Login /> : <Navigate to='/' />}
					/>
					<Route path='/register'
						element={!user ? <Register /> : <Navigate to='/' />}
					/>
					<Route path="/chats/:unameB"
						element={user ? <Chat /> : <Navigate to='/login' />}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
