import test from "../assets/homepage_image.png"

export default function LiveResults() {
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
                {/* each role section here */}
                <section className="mb-10">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                        <h2 className="text-[#111418] text-xl font-bold">test</h2>
                    </div>
                    {/* each candidate in that role here */}
                    <div className="space-y-4">
                        <div
                            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-3">
                                    <img className="size-10 rounded-full" src={test} />
                                    <div>
                                        <p className="text-[#111418] font-bold text-base">Sarah Jenkins</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-[#137fec] leading-none">12,450</p>
                                    <p className="text-xs font-medium text-[#617589] mt-1">54.2%</p>
                                </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <div className="bg-[#137fec] h-full rounded-full w-[54.2%]"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}