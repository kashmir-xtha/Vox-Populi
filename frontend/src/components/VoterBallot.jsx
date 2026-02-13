import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"

export default function VoterBallot() {
    const navigate = useNavigate()
    const [candidates, setCandidates] = useState([])
    const [positions, setPositions] = useState([])

    const fetchPositions = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/positions")
                if (response.data.positions) {
                    setPositions(response.data.positions)
                }
            }
            catch (error) {
                console.log(error)
            }
        }
        
        const fetchCandidates = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/candidates")
                console.log(response.data.candidates)
                if (response.data.candidates) {
                    setCandidates(response.data.candidates.filter(
                        (candidate) => candidate.status === "approved"
                    ))
                }
            } catch (error) {
                console.log(error)
            }
        }

    useEffect(() => {
        fetchPositions()
        fetchCandidates()

        const token = localStorage.getItem("token")
        const role = token ? JSON.parse(atob(token)).role : ""

        if (role !== 'voter') {
            navigate('/')
        }
    }, [navigate])
    return (<>
        <main className="flex-1 w-full max-w-200 mx-auto py-10 px-4 md:px-0">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] mb-3">Voter Election Ballot</h1>
                <p className="text-[#617589] text-base max-w-xl mx-auto">Select one candidate for each of the following positions. After making your selections, review your ballot for final submission.</p>
            </div>
            <section>
                {/* repeat this for each position  */}
                {positions.map((position, index) => {

                    // get candidates for this position
                    const filteredCandidates = candidates.filter(
                        item => item.position === position[1]
                    );

                    // 🚫 if none exist, render nothing
                    if (filteredCandidates.length === 0) return null;

                    return (
                        <div key={index} className="mb-12">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <span className="size-2 bg-[#137fec] rounded-full"></span>
                                    {position[1]}
                                </h2>

                                <span className="text-xs font-bold text-[#137fec] uppercase tracking-widest bg-[#137fec]/10 px-2 py-1 rounded">
                                    Choose 1
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredCandidates.map((item, index) => (
                                    <div key={index}
                                        className="bg-white rounded-xl border border-[#f0f2f4] overflow-hidden group hover:shadow-xl hover:shadow-[#137fec]/5 transition-all duration-300">

                                        <div className="relative h-48 overflow-hidden">
                                            <img src={item.photo_url} alt="Candidate Photo" />
                                        </div>

                                        <div className="p-5">
                                            <h3 className="text-xl font-bold mb-1">
                                                {item.full_name}
                                            </h3>

                                            <p className="text-sm h-32 text-gray-500 line-clamp-6 mb-4 leading-relaxed">
                                                {item.statement}
                                            </p>

                                            <button className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-lg h-10 bg-[#137fec] text-white text-sm font-bold">
                                                Cast Vote
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

            </section>
        </main>
        <div
            className="bg-white/90 backdrop-blur-md border-[#f0f2f4] p-4">
            <div className="max-w-200 mx-auto flex items-center justify-between gap-4">
                <div className="hidden md:block">
                    <p className="text-sm font-medium text-[#617589] ">Total Selections: <span
                        className="text-[#137fec] font-bold">{`0/${positions.length}`}</span></p>
                </div>
                <button
                    className="cursor-pointer w-full md:w-auto px-8 h-12 rounded-xl bg-[#137fec] text-white font-bold text-base hover:bg-[#137fec]/90 transition-all shadow-lg shadow-[#137fec]/25 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">how_to_vote</span>
                    Confirm Selections
                </button>
            </div>
        </div>
    </>)
}