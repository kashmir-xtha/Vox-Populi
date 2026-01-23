import { NavLink } from "react-router-dom"

function AdminDashboard() {
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
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#137fec]/10 text-[#137fec]">
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
                            </nav>
                        </div>
                    </div>
                </aside>
                <main className="flex-1 flex flex-col overflow-y-auto bg-background-light">
                    <div className="max-w-6xl mx-auto w-full p-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-[#111418] text-3xl font-black tracking-tight">Admin Dashboard</h1>
                                <p className="text-[#617589] text-base font-normal">Monitor all election activity and manage positions from a single view.</p>
                            </div>
                            <NavLink
                                to='/adminCreatePositions'
                                className="bg-[#137fec] hover:bg-[#137fec]/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#137fec]/20 transition-all">
                                <span className="material-symbols-outlined">add_circle</span>
                                Create New Position
                            </NavLink>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div
                                className="flex flex-col gap-2 rounded-xl p-6 bg-white border-[#dbe0e6] shadow-sm">
                                <div className="flex justify-between items-start">
                                    <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">
                                        Total Voters</p>
                                    <span className="material-symbols-outlined text-[#137fec]">groups</span>
                                </div>
                                <p className="text-[#111418] text-3xl font-black leading-tight">0</p>
                            </div>
                            <div
                                className="flex flex-col gap-2 rounded-xl p-6 bg-white border-[#616161] shadow-sm">
                                <div className="flex justify-between items-start">
                                    <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">
                                        Active Positions</p>
                                    <span className="material-symbols-outlined text-[#137fec]">ballot</span>
                                </div>
                                <p className="text-[#111418]  text-3xl font-black leading-tight">0</p>
                            </div>
                            <div
                                className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-[#dbe0e6] shadow-sm">
                                <div className="flex justify-between items-start">
                                    <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">
                                        Pending Approvals</p>
                                    <span className="material-symbols-outlined text-[#137fec]">pending_actions</span>
                                </div>
                                <p className="text-[#111418] text-3xl font-black leading-tight">0</p>
                            </div>
                        </div>
                        <div
                            className="bg-white border border-[#dbe0e6] rounded-xl shadow-sm">
                            <div
                                className="px-6 py-5 border-b border-[#dbe0e6] flex items-center justify-between">
                                <h3 className="text-lg font-bold text-[#111418]">Vote Monitoring Log</h3>
                                <span className="flex items-center gap-1 text-[#137fec] text-sm font-semibold">
                                    <span className="relative flex h-2 w-2">
                                        <span
                                            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#137fec] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#137fec]"></span>
                                    </span>
                                    Live Updates
                                </span>
                            </div>
                            <div className="w-full flex">
                                <div className="w-1/4 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#617589]">
                                    Voter Name</div>
                                <div className="w-1/4 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#617589]">
                                    Position</div>
                                <div className="w-1/4 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#617589]">
                                    Candidate Choice</div>
                                <div className="w-1/4 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#617589]">
                                    Timestamp</div>
                            </div>
                            {/* Iterate votes log from here using map function */}
                            <div className="h-[60vh] overflow-scroll ">
                                <div className="flex items-center justify-between">
                                    <div className="w-1/4 px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111418]">
                                        test</div>
                                    <div className="w-1/4 px-6 py-4 whitespace-nowrap text-sm text-[#617589]">
                                        test</div>
                                    <div className="w-1/4 px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#137fec]">
                                        test</div>
                                    <div className="w-1/4 px-6 py-4 whitespace-nowrap text-sm text-[#617589]">
                                        2026-01-22 14:10:00</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default AdminDashboard