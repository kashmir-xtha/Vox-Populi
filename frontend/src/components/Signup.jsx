import { useState } from "react"

function Signup() {
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("admin")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        const loginData = {
            role,
            username,
            password,
        }
        console.log(loginData); // send this to backend later
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-4xl font-black tracking-tight mb-4 text-gray-900">
                        Your Vote, Your Power
                    </h1>
                    <p className="text-base md:text-lg font-light text-gray-600 leading-relaxed">
                        Secure, transparent, and direct. Join thousands of citizens participating in the future of our
                        community through our digital portal.
                    </p>
                </div>
                <div
                    className="bg-white  rounded-2xl p-8 shadow-2xl border border-[#f0f2f4]">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-bold tracking-tight">Select Role</label>
                            <div className="relative">
                                <select
                                    value={role} onChange={(e) => setRole(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#137fec] focus:border-transparent transition-all outline-none appearance-none">
                                    <option value="admin">Administrator</option>
                                    <option value="candidate">Candidate</option>
                                    <option value="voter">Voter</option>
                                </select>
                                <span
                                    className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold tracking-tight">Username</label>
                            <div className="relative">
                                <span
                                    className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">person</span>
                                <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#137fec] focus:border-transparent transition-all outline-none"
                                    placeholder="Enter your username" type="text" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold tracking-tight">Password</label>
                            <div className="relative">
                                <span
                                    className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">lock</span>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#137fec] focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••" type={`${showPassword ? "text" : "password"}`} />
                                <span
                                    className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 hover:text-[#137fec] cursor-pointer"
                                    onClick={() => setShowPassword(prev => !prev)}
                                >visibility</span>
                            </div>
                        </div>
                        <button
                            className="w-full h-12 bg-[#137fec] text-white font-bold rounded-xl hover:bg-[#137fec]/90 transition-all shadow-lg shadow-[#137fec]/25 flex items-center justify-center gap-2"
                            type="submit">
                            Sign Up
                        </button>
                    </form>
                    <div className="pt-6 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-500">By signing up, you agree to the Terms of Service and Privacy Policy.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup