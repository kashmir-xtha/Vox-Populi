import axios from "axios"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"


export default function CandidateApplicationForm() {
    const [selectedFile, setSelectedFile] = useState(null) // is a object-type
    const [preview, setPreview] = useState(null)
    const [positions, setPositions] = useState([])
    const [fullName, setFullName] = useState("")
    const [positionId, setPositionId] = useState("")
    const [statement, setStatement] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef(null)
    const navigate = useNavigate()

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0]

        if (!file) return

        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']

        if (file.size > maxSize) {
            setMessage("File size must be less than 5MB")
            return
        }

        if (!allowedTypes.includes(file.type)) {
            setMessage("Only PNG, JPG, and GIF files are allowed")
            return
        }

        setSelectedFile(file)
        setMessage("")

        // Create preview while uploading
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const resetUpload = () => {
        setSelectedFile(null)
        setPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")
        setLoading(true)

        // Validation
        if (!fullName.trim()) {
            setMessage("Full name is required")
            setLoading(false)
            return
        }

        if (!selectedFile) {
            setMessage("Please upload a photo")
            setLoading(false)
            return
        }

        if (!positionId) {
            setMessage("Please select a position")
            setLoading(false)
            return
        }

        if (!statement.trim()) {
            setMessage("Please enter a candidate statement")
            setLoading(false)
            return
        }
        
        const token = localStorage.getItem("token")
        const user = token ? JSON.parse(atob(token)) : ""

        const formData = new FormData()
        formData.append('user_id', user.id)
        formData.append('full_name', fullName.trim())
        formData.append('pos_id', parseInt(positionId))
        formData.append('photo', selectedFile) // sends actualll file not bs
        formData.append('statement', statement.trim())
        try {
            const response = await axios.post(
                "http://localhost:5000/api/candidates",
                formData
            )

            if (response.data.error) {
                setMessage(response.data.error)
            } else {
                setMessage("✓ Application submitted successfully!")
                setFullName("")
                setStatement("")
                setPositionId("")
                resetUpload()
                setLoading(false)
            }
        } catch (error) {
            setMessage("Failed to submit application")
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/positions")
                if (response.data.positions) {
                    console.log(response.data.positions)
                    setPositions(response.data.positions)
                }
            } catch (error) {
                console.log("Failed to fetch positions")
            }
        }
        fetchPositions()

        const token = localStorage.getItem("token")
        const role = token ? JSON.parse(atob(token)).role : ""

        if (role !== 'candidate') {
            navigate('/')
        }
    }, [navigate])
    return (<>
        <main className="flex-1 flex justify-center py-10 px-4">
            <div className="W-[640px] flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1
                        className="text-[#111418] text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                        Candidate Application Form
                    </h1>
                    <p className="text-[#617589] text-base font-normal leading-normal">
                        Submit your application to be officially registered as a candidate for the upcoming election cycle.
                    </p>
                </div>
                <div
                    className="bg-white rounded-xl shadow-sm border border-[#dbe0e6]  overflow-hidden">
                    <form className="p-6 md:p-8 flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                            <label className="text-[#111418] text-base font-medium leading-normal">
                                Full Name
                            </label>
                            <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="form-input flex w-full rounded-lg text-[#111418] focus:ring-2 focus:ring-[#137fec]/20 border border-[#dbe0e6] bg-white  focus:border-[#137fec] h-14 placeholder:text-[#617589] px-4 text-base font-normal transition-all"
                                placeholder="Enter your full legal name" required type="text" />
                            <p className="text-xs text-gray-500">As it appears on your government-issued ID.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[#111418] text-base font-medium leading-normal">
                                Upload Candidate Photo
                            </label>
                            <div className="relative group">
                                {!preview ?
                                    <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-[#dbe0e6] rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="material-symbols-outlined text-[#617589] text-3xl mb-2">
                                                add_a_photo
                                            </span>
                                            <p className="text-sm text-[#617589] font-medium">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-[#617589] mt-1">
                                                PNG, JPG or GIF (max. 5MB)
                                            </p>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            accept="image/*"
                                            className="hidden"
                                            type="file"
                                            onChange={handleFileChange}
                                        />
                                    </label> :
                                    <div className="w-full h-52 flex items-center px-1.5 border-2 border-dashed border-[#dbe0e6] rounded-lg">
                                        <div className="h-48 aspect-video relative">
                                            <img
                                                src={preview}
                                                alt="Ballot preview"
                                                className="w-full h-full object-cover rounded-lg border-2 border-[#dbe0e6]"
                                            />
                                            <button
                                                type="button"
                                                onClick={resetUpload}
                                                className="w-6 h-6 flex items-center justify-center absolute -top-2 -right-2 bg-gray-500 text-white rounded-full cursor-pointer"
                                            >
                                                x
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                            <p className="text-xs text-gray-500 font-medium">Please upload a professional headshot for the ballot.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[#111418] text-base font-medium leading-normal">
                                Position Selection
                            </label>
                            <div className="relative">
                                <select
                                    value={positionId}
                                    onChange={(e) => setPositionId(e.target.value)}
                                    className="flex w-full rounded-lg text-[#111418] focus:ring-2 focus:ring-[#137fec]/20 border border-[#dbe0e6] bg-white focus:border-[#137fec] h-14 px-4 text-base font-normal transition-all"
                                    required
                                >
                                    <option disabled value="">
                                        Select the position you're running for
                                    </option>
                                    {positions.map((position, index) => (
                                        <option key={position[0]} value={position[0]}>
                                            {position[1]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-end">
                                <label className="text-[#111418] text-base font-medium leading-normal">
                                    Candidate Statement
                                </label>
                                <span className="text-xs font-medium text-[#137fec] bg-[#137fec]/10 px-2 py-1 rounded">{statement.length}/200</span>
                            </div>
                            <textarea
                                value={statement}
                                onChange={(e) => setStatement(e.target.value)}
                                className="form-textarea flex w-full rounded-lg text-[#111418] focus:ring-2 focus:ring-[#137fec]/20 border border-[#dbe0e6] bg-white focus:border-[#137fec] min-h-30 placeholder:text-[#617589] p-4 text-base font-normal leading-relaxed resize-none transition-all"
                                maxLength="200" placeholder="Briefly state your vision and key objectives..." required></textarea>
                            <p className="text-xs text-gray-500">This statement will be visible to all voters
                                on the ballot paper.</p>
                        </div>
                        {message && (
                            <div className={`text-sm px-4 py-3 rounded ${message.includes('✓') || message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message}
                            </div>
                        )}
                        <div className="pt-4">
                            <button
                                disabled={loading}
                                className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-lg bg-[#137fec] text-white h-14 text-base font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-[#137fec]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit">
                                <span className="material-symbols-outlined">how_to_reg</span>
                                {loading ? "Submitting..." : "Submit Application"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </>)
}