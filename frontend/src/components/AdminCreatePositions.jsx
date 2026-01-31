import { NavLink, useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function AdminCreatePositions() {
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        // sending data to positions table here **************
    }
    
    useEffect(() => {
        const token = localStorage.getItem("token")
        const role = token ? JSON.parse(atob(token)).role : ""

        if (role !== 'admin') {
            navigate('/')
        }
    }, [navigate])
    return (
        <>
            <div className="flex overflow-hidden">
                <aside
                    className="w-64 shrink-0 border-r border-[#dbe0e6] bg-white  flex flex-col">
                    <div className="flex flex-col h-full p-4">
                        <div className="flex flex-col gap-4">
                            <nav className="flex flex-col gap-1">
                                <NavLink
                                    to='/adminDashboard'
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#111418] ">
                                    <span className="material-symbols-outlined text-[24px]">dashboard</span>
                                    <p className="text-sm font-medium">Dashboard</p>
                                </NavLink>
                                <NavLink
                                    to='/adminCreatePositions'
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#137fec]/10 text-[#137fec]">
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
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#111418]">
                                    <span className="material-symbols-outlined text-[24px]">analytics</span>
                                    <p className="text-sm font-medium">Results</p>
                                </NavLink>
                            </nav>
                        </div>
                    </div>
                </aside>
                <main className="flex-1">
                    <div className="mx-auto max-w-180 w-full px-6 py-10">
                        <div className="mb-8">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-[#111418] tracking-tight text-3xl font-bold leading-tight">
                                    Add New Position</h1>
                                <p className="text-[#617589] text-base font-normal leading-normal">Create a new position for
                                    candidates to run for.</p>
                            </div>
                        </div>
                        <div
                            className="bg-white  border border-[#e5e7eb]  rounded-xl shadow-sm overflow-hidden">
                            <div className="p-8">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-lg font-bold text-[#111418] ">Position Details</h4>
                                        <p className="text-sm text-[#617589]">Enter the title and selection rules for this
                                            voting category.</p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex flex-col gap-2">
                                            <label
                                                className="text-[#111418]  text-sm font-semibold leading-normal">
                                                Position Title
                                            </label>
                                            <input
                                                className="form-input block w-full rounded-lg border-[#dbe0e6]  bg-white text-[#111418] h-12 px-4 text-base focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] placeholder:text-[#617589]"
                                                placeholder="e.g. Student Body President" required="" type="text" />
                                            <p className="text-[#617589] text-xs">This title will be displayed as a heading on
                                                the voting page.</p>
                                        </div>
                                    </div>
                                    <div
                                        className="pt-6 flex items-center justify-end gap-3 border-t border-[#f0f2f4]">
                                        <button
                                            className="cursor-pointer px-8 py-2.5 rounded-lg bg-[#137fec] text-white text-sm font-bold shadow-md hover:bg-[#137fec]/90 transition-all flex items-center gap-2"
                                            type="submit">
                                            <span>Create Position</span>
                                            <span className="material-symbols-outlined text-sm">add</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}