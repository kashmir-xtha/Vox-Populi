import { NavLink, useNavigate } from "react-router-dom"
import test from "../assets/homepage_image.png"
import { useEffect } from "react"

export default function AdminApproveCandidates() {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        const role = token ? JSON.parse(atob(token)).role : ""
        
        if (role !== 'admin') {
            navigate('/')
        }
    },[navigate])
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
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#137fec]/10 text-[#137fec]">
                                    <span className="material-symbols-outlined text-[24px]">group</span>
                                    <p className="text-sm font-medium">Candidates</p>
                                </NavLink>
                                <NavLink
                                    to='/adminResults'
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#111418]">
                                    <span className="material-symbols-outlined text-[24px]">analytics</span>
                                    <p className="text-sm font-medium">Results</p>
                                </NavLink>
                            </nav>
                        </div>
                    </div>
                </aside>
                <main className="p-8 max-w-7xl mx-auto w-full">
                    <div className="mb-8">
                        <h1 className="text-[#111418] text-4xl font-black leading-tight tracking-[-0.033em]">
                            Candidate Approvals</h1>
                        <p className="text-[#617589] text-base font-normal leading-normal mt-2">Review and manage pending candidate applications for the upcoming Election 2026.</p>
                    </div>
                    <div
                        className="bg-white  rounded-xl border border-[#f0f2f4]  shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#f0f2f4] ">
                            <h2 className="text-[#111418] text-lg font-bold">Pending Candidate Applications</h2>
                        </div>
                        <div className="w-full flex">
                            <div className="w-1/3 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#617589]">
                                Candidate Name</div>
                            <div className="w-1/3 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#617589]">
                                Applied Position</div>
                            <div className="w-1/3 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#617589] flex justify-end">
                                Actions</div>
                        </div>
                        <div className="h-[60vh] overflow-scroll ">
                            {/* Iterate votes log from here using map function */}
                            <div className="flex items-center justify-between">
                                <div className="w-1/3 px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111418]">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-[#137fec] font-bold overflow-hidden"
                                            data-alt="Candidate profile photo">
                                            <img alt="John Doe" className="w-full h-full object-cover" src={test} />
                                        </div>
                                        <div>
                                            <p className="text-[#111418] font-bold">test</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/3 px-6 py-4 text-[#137fec] text-xs font-bold">
                                    test
                                </div>
                                <div className="w-1/3 px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#137fec]">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="cursor-pointer flex items-center gap-1 bg-[#22c55e] hover:bg-[#16a34a] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                            Approve
                                        </button>
                                        <button
                                            className="cursor-pointer flex items-center gap-1 bg-[#ef4444] hover:bg-[#9c0101] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">cancel</span>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}