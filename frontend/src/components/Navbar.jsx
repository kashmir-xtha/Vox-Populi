import { useNavigate, NavLink } from "react-router-dom"

function Navbar() {
    const token = localStorage.getItem("token")
    const username = token ? JSON.parse(atob(token)).username : ""
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate('/login')
    }
    return (
        <>
            <header className="w-full flex items-center justify-between border-b border-solid border-gray-200 px-6 py-4 bg-white z-20 sticky top-0">
                <div className="flex items-center gap-2">
                    <div className="text-[#137fec] size-6 flex items-center justify-center">
                        <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"></path>
                        </svg>
                    </div>
                    <NavLink to='/' className="text-xl font-black leading-tight tracking-tight">VoxPopuli</NavLink>
                </div>
                {token ? /*If no token; no login */
                    <div className="flex gap-3">
                        <div className="flex items-center font-bold">{username}</div>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-950/30 cursor-pointer font-semibold transition-colors">
                            <span className="material-symbols-outlined">logout</span>
                            <span>Log Out</span>
                        </button>
                    </div>
                    :
                    <div className="flex items-center gap-10">
                        <NavLink
                            to='/login'
                            className="flex items-center justify-center h-10 text-[#137fec] text-sm font-bold hover:bg-[#137fec]/5 transition-colors cursor-pointer">
                            Login
                        </NavLink>
                        <NavLink
                            to='/signup'
                            className="flex items-center justify-center rounded-lg h-10 px-6 bg-[#137fec] text-white text-sm font-bold hover:bg-[#137fec]/90 transition-colors shadow-lg shadow-[#137fec]/20 cursor-pointer">
                            Sign Up
                        </NavLink>
                    </div>
                }
            </header>
        </>
    )
}

export default Navbar