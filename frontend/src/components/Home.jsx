import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import image from '../assets/homepage_image.png'

function Home() {
    const navigate = useNavigate()

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
            <section
                className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center p-10 gap-12 lg:gap-20">
                <div className="w-full lg:w-1/2 flex flex-col">
                    <div className="max-w-xl">
                        <h1
                            className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-[-0.04em] mb-8 text-[#111418]">
                            Empowering <div>every voice.</div>
                        </h1>
                        <p className="text-xl lg:text-2xl text-[#617589]  mb-12 font-normal leading-relaxed">
                            Your vote is the foundation of our collective future. Join the conversation and lead the change
                            in your community with secure, modern digital voting.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                            <div className="flex gap-5 items-start">
                                <div
                                    className="shrink-0 w-14 h-14 bg-[#137fec]/10 rounded-2xl flex items-center justify-center text-[#137fec] shadow-sm border border-[#137fec]/10">
                                    <span className="material-symbols-outlined text-3xl">chat</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Your Voice</h3>
                                    <p className="text-[#617589] text-lg">Every vote is a testament to your
                                        perspective and values. Make it heard instantly.</p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start">
                                <div
                                    className="shrink-0 w-14 h-14 bg-[#137fec]/10 rounded-2xl flex items-center justify-center text-[#137fec] shadow-sm border border-[#137fec]/10">
                                    <span className="material-symbols-outlined text-3xl">trending_up</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Your Future</h3>
                                    <p className="text-[#617589] text-lg">Shape the path of our collective
                                        tomorrow through active and safe participation.</p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start">
                                <div
                                    className="shrink-0 w-14 h-14 bg-[#137fec]/10 rounded-2xl flex items-center justify-center text-[#137fec] shadow-sm border border-[#137fec]/10">
                                    <span className="material-symbols-outlined text-3xl">groups</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Your Community</h3>
                                    <p className="text-[#617589] text-lg">Strengthen the bonds that hold us
                                        together by making your mark on local decisions.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 flex justify-center items-center">
                    <div className="relative w-full aspect-square max-w-125">
                        <div className="absolute inset-0 bg-[#137fec]/10 rounded-full blur-3xl opacity-50"></div>
                        <div
                            className="relative z-10 w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                            <img alt="Diverse group participating in an election process" className="w-full h-full object-cover"
                                src={image} />
                            <div
                                className="absolute inset-0 bg-linear-to-tr from-[#137fec]/20 to-transparent mix-blend-multiply">
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home 