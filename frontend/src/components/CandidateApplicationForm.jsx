import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


export default function CandidateApplicationForm() {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        const role = token ? JSON.parse(atob(token)).role : ""

        if (role !== 'candidate') {
            navigate('/')
        }
    }, [navigate])
    return (<>
        <main class="flex-1 flex justify-center py-10 px-4">
            <div class="W-[640px] flex flex-col gap-6">
                <div class="flex flex-col gap-2">
                    <h1
                        class="text-[#111418] text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                        Candidate Application Form
                    </h1>
                    <p class="text-[#617589] text-base font-normal leading-normal">
                        Submit your application to be officially registered as a candidate for the upcoming election cycle.
                    </p>
                </div>
                <div
                    class="bg-white rounded-xl shadow-sm border border-[#dbe0e6]  overflow-hidden">
                    <form class="p-6 md:p-8 flex flex-col gap-6">
                        <div class="flex flex-col gap-2">
                            <label class="text-[#111418] text-base font-medium leading-normal">
                                Full Name
                            </label>
                            <input
                                class="form-input flex w-full rounded-lg text-[#111418] focus:ring-2 focus:ring-[#137fec]/20 border border-[#dbe0e6] bg-white  focus:border-[#137fec] h-14 placeholder:text-[#617589] px-4 text-base font-normal transition-all"
                                placeholder="Enter your full legal name" required="" type="text" />
                            <p class="text-xs text-gray-500">As it appears on your government-issued ID.
                            </p>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-[#111418] text-base font-medium leading-normal">
                                Upload Candidate Photo
                            </label>
                            <div class="relative group">
                                <label
                                    class="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-[#dbe0e6] rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                                    <div class="flex flex-col items-center justify-center">
                                        <span
                                            class="material-symbols-outlined text-[#617589] text-3xl mb-2">add_a_photo</span>
                                        <p class="text-sm text-[#617589] font-medium">Click to upload or
                                            drag and drop</p>
                                        <p class="text-xs text-[#617589] mt-1">PNG, JPG or GIF (max. 5MB)
                                        </p>
                                    </div>
                                    <input accept="image/*" class="hidden" type="file" />
                                </label>
                            </div>
                            <p class="text-xs text-gray-500 font-medium">Please upload a professional headshot for the ballot.</p>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-[#111418] text-base font-medium leading-normal">
                                Position Selection
                            </label>
                            <div class="relative">
                                <select
                                    class="form-select appearance-none flex w-full rounded-lg text-[#111418] focus:ring-2 focus:ring-[#137fec]/20 border border-[#dbe0e6] bg-white focus:border-[#137fec] h-14 px-4 text-base font-normal transition-all">
                                    <option disabled="" selected="" value="">Select the position you're running for</option>
                                    <option value="test">test</option>
                                </select>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <div class="flex justify-between items-end">
                                <label class="text-[#111418] text-base font-medium leading-normal">
                                    Candidate Statement
                                </label>
                                <span class="text-xs font-medium text-[#137fec] bg-[#137fec]/10 px-2 py-1 rounded">Limit: 3
                                    Lines</span>
                            </div>
                            <textarea
                                class="form-textarea flex w-full rounded-lg text-[#111418] focus:ring-2 focus:ring-[#137fec]/20 border border-[#dbe0e6] bg-white focus:border-[#137fec] min-h-30 placeholder:text-[#617589] p-4 text-base font-normal leading-relaxed resize-none transition-all"
                                maxlength="200" placeholder="Briefly state your vision and key objectives..."></textarea>
                            <p class="text-xs text-gray-500">This statement will be visible to all voters
                                on the ballot paper.</p>
                        </div>
                        <div class="pt-4">
                            <button
                                class="cursor-pointer w-full flex items-center justify-center gap-2 rounded-lg bg-[#137fec] text-white h-14 text-base font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-[#137fec]/20"
                                type="submit">
                                <span class="material-symbols-outlined">how_to_reg</span>
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </>)
}