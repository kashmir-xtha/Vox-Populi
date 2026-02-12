import test from "../assets/homepage_image.png"

export default function LiveResults() {
    return (
        <>
            <main class="w-full mx-auto p-8">
                <div class="flex flex-col items-center mb-8">
                    <h1 class="text-[#111418] text-[32px] font-bold leading-tight text-center">Live Election Results</h1>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="relative flex h-2 w-2">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <p class="text-[#617589] text-sm font-normal">Live updating • Last updated: Just now
                        </p>
                    </div>
                </div>
                {/* each role section here */}
                <section class="mb-10">
                    <div class="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                        <h2 class="text-[#111418] text-xl font-bold">test</h2>
                    </div>
                    {/* each candidate in that role here */}
                    <div class="space-y-4">
                        <div
                            class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div class="flex justify-between items-center mb-3">
                                <div class="flex items-center gap-3">
                                    <img class="size-10 rounded-full" src={test} />
                                    <div>
                                        <p class="text-[#111418] font-bold text-base">Sarah Jenkins</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-xl font-bold text-[#137fec] leading-none">12,450</p>
                                    <p class="text-xs font-medium text-[#617589] mt-1">54.2%</p>
                                </div>
                            </div>
                            <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <div class="bg-[#137fec] h-full rounded-full w-[54.2%]"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}