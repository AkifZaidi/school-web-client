import React, { useEffect, useRef, useState } from "react";
import "../style/RecordLectures.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { FreeMode, Pagination } from "swiper/modules";
import { Video } from "lucide-react";
import axios from "axios";

function RecordLectures() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [recordedLectures, setRecordedLectures] = useState([]);
    const videoRefs = useRef([]);

    useEffect(() => {
        try {
            axios.get("http://localhost:5000/recordedLectures/allVideos")
                .then((response) => {
                    setRecordedLectures(response.data);
                });
        } catch (error) {
            console.error("Error fetching recorded lectures:", error);
        }
    }, [])


    const openModal = (videoSrc) => {
        setSelectedVideo(videoSrc);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedVideo(null);
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {
                recordedLectures.length === 0 ? (
                    <div className="text-center text-white mt-20">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Recorded Lectures</h2>
                        <p className="text-gray-300 text-sm">No recorded lectures available. Please check back later.</p>
                    </div>
                ) : (
                    <>
                        {/* Heading & Description */}
                        <div className="text-center text-white mt-20">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Recorded Lecture</h2>
                            <p className="text-gray-300 text-sm">Watch this recorded lecture to revise important concepts.</p>
                        </div>
                        <Swiper
                            breakpoints={{
                                340: { slidesPerView: 2, spaceBetween: 15 },
                                700: { slidesPerView: 3, spaceBetween: 15 },
                            }}
                            freeMode={true}
                            pagination={{ clickable: true }}
                            modules={[FreeMode, Pagination]}
                            className="max-w-4xl w-full mt-12"
                        >
                            {recordedLectures.map((item, idx) => {
                                const videoUrl = `http://localhost:5000/uploads/${item.videoUrl}`;
                                return (
                                    <SwiperSlide key={item.title}>
                                        <div className="video-card flex flex-col gap-3 mb-20 group relative shadow-lg text-white rounded-xl p-4 overflow-hidden cursor-pointer">
                                            <div className="relative w-full h-full flex items-center justify-center">
                                                <video
                                                    ref={(el) => (videoRefs.current[idx] = el)}
                                                    src={videoUrl}
                                                    className="relative w-80 h-64 object-cover transition-all duration-300"
                                                    controlsList="nodownload"
                                                    disablePictureInPicture={false}
                                                />
                                            </div>
                                            {/* <div className="absolute top-40 left-32 flex flex-col gap-2"> */}
                                            <button
                                                onClick={() => openModal(videoUrl)}
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105 active:scale-95"
                                            >
                                                <Video className="w-8 h-8 text-white" />
                                            </button>
                                            {/* </div> */}
                                        </div>
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                    </>
                )
            }


            {/* Modal with 90% Width & Height */}
            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    {/* Modal Box */}
                    <div className="relative w-[90%] h-[90%] bg-black rounded-lg overflow-hidden flex items-center justify-center">

                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-5 right-5 text-white text-3xl font-bold hover:text-gray-500 z-10"
                        >
                            ✖
                        </button>

                        {/* Video */}
                        <video
                            src={selectedVideo}
                            className="w-full h-full object-fill"
                            controls
                            autoPlay
                        />
                    </div>
                </div>
            )}

        </div>
    );
}

export default RecordLectures;