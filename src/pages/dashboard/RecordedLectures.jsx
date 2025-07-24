import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UploadCloud, FileVideo, Trash2 } from "lucide-react";
import axios from "axios"; // ✅ Backend se connect karne ke liye axios use karein

const UploadRecordedLectures = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    // Handle File Selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file && file.type.startsWith("video/")) {
            const videoUrl = URL.createObjectURL(file);
            setSelectedVideo(file);
            setPreviewUrl(videoUrl);
        } else {
            alert("Please upload a valid video file!");
        }
    };

    // Remove Selected Video
    const removeVideo = () => {
        setSelectedVideo(null);
        setPreviewUrl("");
    };

    // Handle Upload (Send Video to Backend)
    const handleUpload = async () => {
        if (!selectedVideo) {
            alert("No video selected!");
            return;
        }

        const formData = new FormData();
        formData.append("video", selectedVideo);

        try {
            setUploading(true);

            const response = await axios.post(
                "http://localhost:5000/recordedLectures/upload", // ✅ Your backend API URL
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            alert("Lecture Uploaded Successfully!");
            navigate("/recorded-lectures"); // Redirect to Recorded Lectures page
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload video!");
        } finally {
            setUploading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md"
        >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileVideo size={24} className="text-blue-500" /> Upload Recorded Lectures
            </h2>

            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition">
                {!selectedVideo ? (
                    <>
                        <UploadCloud size={40} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Click to Upload a Video</p>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="fileInput"
                        />
                        <label
                            htmlFor="fileInput"
                            className="mt-3 block bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600"
                        >
                            Choose File
                        </label>
                    </>
                ) : (
                    <div className="relative">
                        <video src={previewUrl} controls className="w-full rounded-lg mt-3"></video>
                        <button
                            className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                            onClick={removeVideo}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Upload Button */}
            {selectedVideo && (
                <button
                    className={`mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Upload Lecture"}
                </button>
            )}
        </motion.div>
    );
};

export default UploadRecordedLectures;
