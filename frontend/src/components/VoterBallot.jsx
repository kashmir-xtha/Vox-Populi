import image from "../assets/homepage_image.png"

export default function VoterBallot() {
    return (<>
        <main className="flex-1 w-full max-w-200 mx-auto py-10 px-4 md:px-0">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] mb-3">Voter Election Ballot</h1>
                <p className="text-[#617589] text-base max-w-xl mx-auto">Select one candidate for each of the following positions. After making your selections, review your ballot for final submission.</p>
            </div>
            <section className="mb-12">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="size-2 bg-[#137fec] rounded-full"></span>
                        President
                    </h2>
                    <span
                        className="text-xs font-bold text-[#137fec] uppercase tracking-widest bg-[#137fec]/10 px-2 py-1 rounded">Choose
                        1</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div
                        class="bg-white rounded-xl border border-[#f0f2f4] overflow-hidden group hover:shadow-xl hover:shadow-[#137fec]/5 transition-all duration-300">
                        <div class="relative h-48 overflow-hidden">
                            <div class="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                data-alt="Candidate Elena Rodriguez portrait">
                                    <img src={image} alt="" />
                                </div>
                        </div>
                        <div class="p-5">
                            <h3 class="text-xl font-bold mb-1">test</h3>
                            <p
                                class="text-sm text-gray-500 line-clamp-6 mb-4 leading-relaxed">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur, doloremque quae, eaque nemo, dolorem voluptatum atque explicabo qui consequatur alias itaque ex molestias nam natus eum laboriosam voluptas at fugit!</p>
                            <button
                                class="cursor-pointer w-full flex items-center justify-center gap-2 rounded-lg h-10 bg-[#137fec] text-white text-sm font-bold tracking-[0.015em] hover:bg-[#137fec]/90 transition-colors shadow-md shadow-[#137fec]/10">
                                <span class="material-symbols-outlined text-[18px]">how_to_vote</span>
                                Cast Vote
                            </button>
                        </div>
                    </div>
                    <div
                        class="bg-white rounded-xl border border-[#f0f2f4] overflow-hidden group hover:shadow-xl hover:shadow-[#137fec]/5 transition-all duration-300">
                        <div class="relative h-48 overflow-hidden">
                            <div class="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                data-alt="Candidate Elena Rodriguez portrait">
                                    <img src={image} alt="" />
                                </div>
                        </div>
                        <div class="p-5">
                            <h3 class="text-xl font-bold mb-1">test</h3>
                            <p
                                class="text-sm text-gray-500 line-clamp-6 mb-4 leading-relaxed">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur, doloremque quae, eaque nemo, dolorem voluptatum atque explicabo qui consequatur alias itaque ex molestias nam natus eum laboriosam voluptas at fugit!</p>
                            <button
                                class="cursor-pointer w-full flex items-center justify-center gap-2 rounded-lg h-10 bg-[#137fec] text-white text-sm font-bold tracking-[0.015em] hover:bg-[#137fec]/90 transition-colors shadow-md shadow-[#137fec]/10">
                                <span class="material-symbols-outlined text-[18px]">how_to_vote</span>
                                Cast Vote
                            </button>
                        </div>
                    </div>
                    <div
                        class="bg-white rounded-xl border border-[#f0f2f4] overflow-hidden group hover:shadow-xl hover:shadow-[#137fec]/5 transition-all duration-300">
                        <div class="relative h-48 overflow-hidden">
                            <div class="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                data-alt="Candidate Elena Rodriguez portrait">
                                    <img src={image} alt="" />
                                </div>
                        </div>
                        <div class="p-5">
                            <h3 class="text-xl font-bold mb-1">test</h3>
                            <p
                                class="text-sm text-gray-500 line-clamp-6 mb-4 leading-relaxed">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur, doloremque quae, eaque nemo, dolorem voluptatum atque explicabo qui consequatur alias itaque ex molestias nam natus eum laboriosam voluptas at fugit!</p>
                            <button
                                class="cursor-pointer w-full flex items-center justify-center gap-2 rounded-lg h-10 bg-[#137fec] text-white text-sm font-bold tracking-[0.015em] hover:bg-[#137fec]/90 transition-colors shadow-md shadow-[#137fec]/10">
                                <span class="material-symbols-outlined text-[18px]">how_to_vote</span>
                                Cast Vote
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        <div
            className="bg-white/90 backdrop-blur-md border-[#f0f2f4] p-4">
            <div className="max-w-200 mx-auto flex items-center justify-between gap-4">
                <div className="hidden md:block">
                    <p className="text-sm font-medium text-[#617589] ">Total Selections: <span
                        className="text-[#137fec] font-bold">0/3</span></p>
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