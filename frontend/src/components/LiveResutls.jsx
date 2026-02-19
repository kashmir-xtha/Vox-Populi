import { useEffect, useState } from "react"
import axios from "axios"

export default function LiveResults() {
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
    const [data, setData] = useState([])
    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/results/live`)
            setData(response.data?.results || [])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 5000)       // ← then every 5 seconds
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <main className="w-full mx-auto p-8">
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-[#111418] text-[32px] font-bold leading-tight text-center">Live Election Results</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="relative flex h-2 w-2">
                            <span
                                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <p className="text-[#617589] text-sm font-normal">Live updating • Last updated: Just now
                        </p>
                    </div>
                </div>
                {data.length === 0 ? (
                    <div className="text-center text-[#617589] text-sm">No results yet.</div>
                ) : (
                    data.map((positionCandidates, index) => (
                        <section className="mb-10" key={`pos-${index}`}>
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                                <h2 className="text-[#111418] text-xl font-bold">
                                    {positionCandidates[0]?.position_title || `Position ${positionCandidates[0]?.pos_id ?? index + 1}`}
                                </h2>
                            </div>
                            <div className="space-y-4">
                                {positionCandidates.map((candidate) => (
                                    <div
                                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                                        key={`${candidate.pos_id}-${candidate.full_name}`}
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    className="size-10 rounded-full object-cover"
                                                    src={candidate.photo_url}
                                                    alt={candidate.full_name}
                                                />
                                                <div>
                                                    <p className="text-[#111418] font-bold text-base">
                                                        {candidate.full_name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-[#137fec] leading-none">
                                                    {candidate.votes}
                                                </p>
                                                <p className="text-xs font-medium text-[#617589] mt-1">
                                                    {candidate.percentage}%
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-[#137fec] h-full rounded-full"
                                                style={{ width: `${candidate.percentage || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))
                )}
            </main>
        </>
    )
}