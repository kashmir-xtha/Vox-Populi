import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"

export default function VoterBallot() {
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
    const navigate = useNavigate()
    const [candidates, setCandidates] = useState([])
    const [positions, setPositions] = useState([])
    const [votes, setVotes] = useState([])
    const token = localStorage.getItem("token")
    const user = token ? JSON.parse(atob(token)) : ""

    const checkStatus = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/votes/voter/${user.id}`, {
            })
            if (response.data.already_voted) {
                navigate('/liveResults')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchPositions = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/positions`)
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
            const response = await axios.get(`${API_BASE_URL}/api/candidates`)
            if (response.data.candidates) {
                setCandidates(response.data.candidates.filter(
                    (candidate) => candidate.status === "approved"
                ))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = () => {
        votes.forEach(async vote => {
            try {
                await axios.post(`${API_BASE_URL}/api/votes`, {
                    voter_id: user.id,
                    candidate_id: vote.candidate,
                    pos_id: vote.position
                })
            } catch (error) {
                console.log(error)
            }
        })
        setTimeout(() => {
            navigate('/liveResults')
        }, 500)
    }

    useEffect(() => {
        checkStatus()
        fetchPositions()
        fetchCandidates()

        if (user.role !== 'voter') {
            navigate('/')
        }
    }, [navigate])
    return (<>
        <main className="flex-1 w-full max-w-200 mx-auto py-5 px-4 md:px-0">
            <div className="mb-5 text-center">
                <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] mb-3">Voter Election Ballot</h1>
                <p className="text-[#617589] text-base max-w-xl mx-auto">Select one candidate for each of the following positions. After making your selections, review your ballot for final submission.</p>
            </div>
            <section>
                {positions.map((position, index) => {
                    const filteredCandidates = candidates.filter(
                        item => item.position === position[1]
                    )
                    if (filteredCandidates.length === 0) return null

                    return (
                        <div key={index} className="mb-5">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <span className="size-2 bg-[#137fec] rounded-full"></span>
                                    {position[1]}
                                </h2>
                                <span className="text-xs font-bold text-[#137fec] uppercase tracking-widest bg-[#137fec]/10 px-2 py-1 rounded">
                                    Choose 1
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-7">
                                {filteredCandidates.map((candidate, candidateIndex) => {
                                    // Check if this candidate is voted for this position
                                    const isVoted = votes.some(
                                        vote => vote.position === position[0] && vote.candidate === candidate.id
                                    )

                                    return (
                                        <div key={candidateIndex}
                                            className="bg-white rounded-xl border border-[#f0f2f4] overflow-hidden group hover:shadow-xl hover:shadow-[#137fec]/5 transition-all duration-300">
                                            <div className="relative h-48 overflow-hidden object-contain">
                                                <img className="w-full h-full object-cover" src={candidate.photo_url} alt="Candidate Photo" />
                                            </div>
                                            <div className="p-5">
                                                <h3 className="text-xl h-7 font-bold mb-1 line-clamp-1">
                                                    {candidate.full_name}
                                                </h3>
                                                <p className="text-sm h-36 text-gray-500 mb-4 leading-relaxed">
                                                    {candidate.statement}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setVotes(prev => {
                                                            // Remove any existing vote for this position
                                                            const filteredVotes = prev.filter(
                                                                vote => vote.position !== position[0]
                                                            );
                                                            // Add the new vote
                                                            return [...filteredVotes, {
                                                                position: position[0],
                                                                candidate: candidate.id
                                                            }]
                                                        })
                                                    }}
                                                    disabled={isVoted}
                                                    className={`cursor-pointer w-full grid place-content-center rounded-lg h-10 text-base font-bold transition-colors ${isVoted
                                                        ? 'bg-green-500 text-white cursor-not-allowed'
                                                        : 'bg-[#137fec] text-white hover:bg-green-400'
                                                        }`}>
                                                    {isVoted ? <div className="flex gap-1 items-center justify-center">
                                                        <span className="material-symbols-outlined">how_to_vote</span>Voted
                                                    </div> : 'Cast Vote'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <hr />
                        </div>
                    )
                })}
            </section>
        </main>
        <div
            className="bg-white/90 backdrop-blur-md border-[#f0f2f4] pb-4">
            <div className="max-w-200 mx-auto flex items-center gap-4">
                <div className="w-xl flex italic text-red-500">Your vote is locked once submitted <br />Please review carefully before confirming !!</div>
                <button
                    onClick={handleSubmit}
                    className="cursor-pointer w-60 px-8 h-12 rounded-xl bg-[#137fec] text-white font-bold text-base hover:bg-green-500 transition-all shadow-lg shadow-[#137fec]/25 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">how_to_vote</span>
                    Confirm Selections
                </button>
            </div>
        </div>
    </>)
}
