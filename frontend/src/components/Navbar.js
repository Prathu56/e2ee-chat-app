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
		<header className="bg-cyan-600 body-font mx-auto flex flex-wrap p-5 flex-row items-center sticky top-0">
			<div className='flex mr-auto px-5'>
				<Link to='/'>
					<span className="text-4xl font-semibold text-gray-100 justify-center">Chat-Nat</span>
				</Link>
			</div>

			{user && (
				<div className='flex flex-row items-center ml-auto px-5'>
					<span className='text-lg font-semibold text-gray-100 mr-10'>{user.username}</span>
					<button onClick={handleClick}
						className="justify-center items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base my-2 mx-5 font-semibold"
					>
						Log out
					</button>
				</div>
			)}
			
			{!user && (
				<div className='flex ml-auto px-5'>
					<Link to='/login'>
						<div className="justify-center items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base my-2 mx-5 font-semibold">
							Log in
						</div>
					</Link>
					<Link to='/register'>
						<div className="justify-center items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base my-2 mx-5 font-semibold">
							Register
						</div>
					</Link>
				</div>
			)}
		</header>
	)
};

export default Navbar;