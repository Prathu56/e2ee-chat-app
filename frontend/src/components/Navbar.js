import { Link } from 'react-router-dom';

const Navbar = () => {
	return (
		<header className="bg-cyan-600 body-font">
			<div className="container mx-auto flex flex-wrap p-5 flex-row items-center">
			<div className='flex mr-auto px-5'>
				<Link to='/'>
					<span className="text-4xl font-semibold text-gray-50 justify-center">Chat-Nat</span>
				</Link>
			</div>
			<div className='flex ml-auto px-5'>
				<Link to='/login'>
					<div className="justify-center items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-lg mt-4 md:mt-0 mx-5 font-semibold">
						Log in
					</div>
				</Link>
				<Link to='/register'>
					<div className="justify-center items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-lg mt-4 md:mt-0 mx-5 font-semibold">
						Register
					</div>
				</Link>
			</div>
			</div>
		</header>
	)
}

export default Navbar;