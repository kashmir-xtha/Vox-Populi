import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'

function AdminPortal() {
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
    const [showPassword, setShowPassword] = useState(false)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const role = "admin"
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (password === "" || username === "") {
            setMessage("Please fill all the fields!!")
            setLoading(false)
            return
        }
        else {
            setMessage("") //clearing the message
            const loginData = {
                role,
                username,
                password,
            }
            try {
                const response = await axios.post(
                    `${API_BASE_URL}/api/login`,
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
                    navigate('/adminDashboard')
                }
            } catch (error) {
                setMessage("Server is offline")
                setLoading(false)
            }
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
        <>
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div
                    className="w-full max-w-120 bg-white  shadow-2xl rounded-xl p-8 border border-gray-100 ">
                    <div className="mb-8">
                        <h1
                            className="text-[#111418]  tracking-tight text-[32px] font-bold leading-tight text-center">
                            Admin Portal Login</h1>
                        <p className="text-gray-500  text-center mt-2">Welcome back. Please sign in to access Admin Panel</p>
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
                            disabled={loading}
                            className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-lg bg-[#137fec] text-white h-12 text-base font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-[#137fec]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit">
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </main>
        </>
    )
}

export default AdminPortal