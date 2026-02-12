import React, { useState, useRef } from 'react';
import axios from 'axios';

const BallotUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' });
    const fileInputRef = useRef(null);

    // File validation
    const validateFile = (file) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

        if (!file) {
            return { valid: false, error: 'No file selected' };
        }

        if (file.size > maxSize) {
            return { valid: false, error: 'File size must be less than 5MB' };
        }

        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: 'Only PNG, JPG, and GIF files are allowed' };
        }

        return { valid: true };
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (!file) return;

        const validation = validateFile(file);

        if (!validation.valid) {
            setUploadStatus({ type: 'error', message: validation.error });
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        setSelectedFile(file);
        setUploadStatus({ type: '', message: '' });

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Handle upload
    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus({ type: 'error', message: 'Please select a file first' });
            return;
        }

        const formData = new FormData();
        formData.append('ballot_image', selectedFile);
        formData.append('voter_id', getCurrentVoterId()); // Replace with your actual voter ID logic

        setUploading(true);
        setUploadStatus({ type: '', message: '' });

        try {
            const response = await axios.post('/api/upload-ballot', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log(`Upload Progress: ${percentCompleted}%`);
                },
            });

            setUploadStatus({
                type: 'success',
                message: 'Ballot uploaded successfully!',
            });

            console.log('Upload successful:', response.data);

            // Reset after 2 seconds
            setTimeout(() => {
                resetUpload();
            }, 2000);

        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Upload failed. Please try again.';
            setUploadStatus({ type: 'error', message: errorMessage });
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    // Reset upload state
    const resetUpload = () => {
        setSelectedFile(null);
        setPreview(null);
        setUploadStatus({ type: '', message: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="relative group">
                {!preview ? (
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
                            disabled={uploading}
                        />
                    </label>
                ) : (
                    <div className="relative border-2 border-dashed border-[#dbe0e6] rounded-lg">
                        <img
                            src={preview}
                            alt="Ballot preview"
                            className="w-full h-52 object-cover rounded-lg border-2 border-[#dbe0e6]"
                        />
                        <button
                            onClick={resetUpload}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                            disabled={uploading}
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Status Messages */}
            {uploadStatus.message && (
                <div
                    className={`mt-4 p-3 rounded-lg text-sm ${
                        uploadStatus.type === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}
                >
                    {uploadStatus.message}
                </div>
            )}

            {/* Upload Button */}
            {selectedFile && !uploadStatus.message && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className={`mt-4 w-full py-3 px-4 rounded-lg font-medium transition-all ${
                        uploading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    {uploading ? (
                        <span className="flex items-center justify-center">
                            <svg
                                className="animate-spin h-5 w-5 mr-3"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Uploading...
                        </span>
                    ) : (
                        'Upload Ballot'
                    )}
                </button>
            )}

            {/* File Info */}
            {selectedFile && (
                <div className="mt-2 text-sm text-gray-600">
                    <p>Selected: {selectedFile.name}</p>
                    <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
            )}
        </div>
    );
};

export default BallotUpload;