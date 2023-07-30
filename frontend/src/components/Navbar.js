import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
	const { logout } = useLogout();
	const { user } = useAuthContext();

	const handleClick = () => {
		logout();
	};

	return (
		<header className="bg-cyan-600 body-font mx-auto flex px-5 py-2 flex-row items-center justify-between sticky top-0">
			<div className='flex px-5'>
				<Link to='/'>
					<span className="text-4xl font-semibold text-gray-100 justify-center">Chat-Nat</span>
				</Link>
			</div>

			{user && (
				<div className='flex flex-col sm:flex-row items-center px-5'>
					<span className='text-base sm:text-lg font-semibold text-gray-100 sm:mr-10 truncate'>{user.username}</span>
					<button onClick={handleClick}
						className="justify-center text-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-xs sm:text-base my-2 mx-5 font-semibold"
					>
						Log out
					</button>
				</div>
			)}
			
			{!user && (
				<div className='flex flex-col sm:flex-row px-5'>
					<Link to='/login'>
						<div className="justify-center text-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-xs sm:text-base my-2 mx-5 font-semibold">
							Log in
						</div>
					</Link>
					<Link to='/register'>
						<div className="justify-center text-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-xs sm:text-base my-2 mx-5 font-semibold">
							Register
						</div>
					</Link>
				</div>
			)}
		</header>
	)
};

export default Navbar;