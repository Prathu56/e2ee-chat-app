import { useEffect, useState } from "react";
import { useRegister } from "../hooks/useRegister";

const Register = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const { register, alertType, alertMessage, isLoading } = useRegister();

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		await register(username, password);
	};

	useEffect(() => setUsername(username.toLowerCase()), [username])

	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
						Register
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
								Username
							</label>
							<div className="mt-2">
								<input
									id="username"
									name="username"
									type="text"
									onChange={(e) => setUsername(e.target.value)}
									value={username}
									autoComplete="username"
									required
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
									Password
								</label>
								<div className="text-sm">
								</div>
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									onChange={(e) => setPassword(e.target.value)}
									value={password}
									autoComplete="current-password"
									required
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div>
							<button disabled={isLoading}
								type="submit"
								className="flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:bg-cyan-500"
							>
								{isLoading ? "Signing up...": "Sign up"}
							</button>
						</div>
					</form>

					{alertType === 'success' && (
						<div className="p-4 my-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
							{alertMessage}
						</div>
					)}

					{alertType === 'fail' && (
						<div className="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
							{alertMessage}
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default Register;