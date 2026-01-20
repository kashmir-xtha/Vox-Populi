import { useState } from "react"

function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [message, setMessage] = useState("")
    const [role, setRole] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (role === "") {
            setMessage("Please select a role!!")
            return
        }
        else {
            setMessage("") //clearing the message
            const loginData = {
                role,
                username,
                password,
            }
            console.log(loginData); // send this to backend later
        }
    }

    return (
        <>
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div
                    className="w-full max-w-120 bg-white  shadow-2xl rounded-xl p-8 border border-gray-100 ">
                    <div className="mb-8">
                        <h1
                            className="text-[#111418]  tracking-tight text-[32px] font-bold leading-tight text-center">
                            Election Portal Login</h1>
                        <p className="text-gray-500  text-center mt-2">Welcome back. Please select your
                            role and sign in.</p>
                    </div>
                    <div className="mb-6">
                        <p className="text-[#111418]  text-sm font-medium leading-normal pb-2 px-1">I am a...
                        </p>
                        <div
                            className="flex h-11 w-full items-center justify-center rounded-lg bg-gray-100  p-1">
                            <label
                                className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-checked:bg-white has-checked:shadow-md has-checked:text-[#137fec] text-gray-500  text-sm font-semibold leading-normal transition-all">
                                <span className="truncate">Admin</span>
                                <input
                                    className="invisible w-0"
                                    name="role-selection"
                                    type="radio"
                                    value="Admin"
                                    checked={role === "Admin"}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </label>
                            <label
                                className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-checked:bg-white has-checked:shadow-md has-checked:text-[#137fec] text-gray-500  text-sm font-semibold leading-normal transition-all">
                                <span className="truncate">Candidate</span>
                                <input
                                    className="invisible w-0"
                                    name="role-selection"
                                    type="radio"
                                    value="Candidate"
                                    checked={role === "Candidate"}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </label>
                            <label
                                className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-checked:bg-white has-checked:shadow-md has-checked:text-[#137fec] text-gray-500  text-sm font-semibold leading-normal transition-all">
                                <span className="truncate">Voter</span>
                                <input
                                    className="invisible w-0"
                                    name="role-selection"
                                    type="radio"
                                    value="Voter"
                                    checked={role === "Voter"}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </label>
                        </div>
                    </div>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col w-full">
                            <label className="flex flex-col w-full">
                                <p className="text-[#111418] text-sm font-medium leading-normal pb-2 px-1">
                                    Username</p>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <span className="material-symbols-outlined text-[20px]">person</span>
                                    </div>
                                    <input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-2 focus:ring-[#137fec]/50 border border-[#dbe0e6] bg-white h-12 placeholder:text-[#617589] pl-10 pr-4 text-base font-normal leading-normal"
                                        placeholder="Enter your username" />
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="flex flex-col w-full">
                                <p className="text-[#111418] text-sm font-medium leading-normal pb-2 px-1">
                                    Password</p>
                                <div className="flex w-full items-stretch rounded-lg">
                                    <div className="relative flex-1">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <span className="material-symbols-outlined text-[20px]">lock</span>
                                        </div>
                                        <input
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-l-lg text-[#111418] focus:outline-0 focus:ring-2 focus:ring-[#137fec]/50 border border-[#dbe0e6] bg-white h-12 placeholder:text-[#617589] pl-10 pr-2 text-base font-normal leading-normal"
                                            placeholder="Enter your password" type={`${showPassword ? "text" : "password"}`} />
                                    </div>
                                    <button
                                        className="text-[#617589] flex border border-[#dbe0e6] border-l-0 bg-white  items-center justify-center px-3 rounded-r-lg hover:text-[#137fec] cursor-pointer transition-colors"
                                        type="button"
                                        onClick={() => { setShowPassword(prev => !prev) }}
                                    >
                                        <span className="material-symbols-outlined">visibility</span>
                                    </button>
                                </div>
                            </label>
                        </div>
                        <div className="h-6 text-center -mt-2 mb-2 text-red-500">{message}</div>
                        <button
                            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#137fec] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#137fec]/90 transition-all shadow-md active:scale-[0.98]"
                            type="submit">
                            <span className="truncate">Login</span>
                        </button>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Login