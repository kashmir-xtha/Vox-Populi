import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Signup() {
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("candidate")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const loginData = {
            role,
            username,
            password,
        }
        try {
            setMessage("")
            const response = await axios.post(
                `${API_BASE_URL}/api/signup`,
                loginData
            )
            setMessage(response.data.error)
            if (response.data.error) {
                setLoading(false)
                return
            }
            else {
                const token = btoa(JSON.stringify(response.data.user))
                localStorage.setItem("token", token)
                const user = JSON.parse(atob(token))
                if (user.role === 'candidate') {
                    navigate('/candidateApplicationForm')
                }
                if (user.role === 'voter') {
                    navigate('/voterBallot')
                }
            }
        } catch (error) {
            setMessage("Server is offline")
            setLoading(false)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        const role = token ? JSON.parse(atob(token)).role : ""

        if (role === 'admin') {
            navigate('/adminDashboard')
        }
        if (role === 'candidate') {
            navigate('/candidateApplicationForm')
        }
        if (role === 'voter') {
            navigate('/voterBallot')
        }
    }, [navigate])

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
                        <div className="h-6 text-center -mt-2 mb-2 text-red-500">{message}</div>
                        <button
                            disabled={loading}
                            className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-lg bg-[#137fec] text-white h-12 text-base font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-[#137fec]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit">
                            {loading ? "Signing up..." : "Sign Up"}
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