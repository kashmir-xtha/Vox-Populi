import { NavLink, useNavigate} from "react-router-dom"
import { useEffect } from "react"

export default function AdminResults() {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        const role = token ? JSON.parse(atob(token)).role : ""

        if (role !== 'admin') {
            navigate('/')
        }
    }, [navigate])
    return (
        <>
            <div className="flex h-screen overflow-hidden">
                <aside
                    className="w-64 shrink-0 border-r border-[#dbe0e6] bg-white  flex flex-col">
                    <div className="flex flex-col h-full p-4">
                        <div className="flex flex-col gap-4">
                            <nav className="flex flex-col gap-1">
                                <NavLink
                                    to='/adminDashboard'
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#111418]">
                                    <span className="material-symbols-outlined text-[24px]">dashboard</span>
                                    <p className="text-sm font-medium">Dashboard</p>
                                </NavLink>
                                <NavLink
                                    to='/adminCreatePositions'
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#111418]">
                                    <span className="material-symbols-outlined text-[24px]">format_list_bulleted</span>
                                    <p className="text-sm font-medium">Positions</p>
                                </NavLink>
                                <NavLink
                                    to='/adminApproveCandidates'
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#111418]">
                                    <span className="material-symbols-outlined text-[24px]">group</span>
                                    <p className="text-sm font-medium">Candidates</p>
                                </NavLink>
                                <NavLink
                                    to='/adminResults'
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#137fec]/10 text-[#137fec]">
                                    <span className="material-symbols-outlined text-[24px]">analytics</span>
                                    <p className="text-sm font-medium">Results</p>
                                </NavLink>
                            </nav>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    )
}