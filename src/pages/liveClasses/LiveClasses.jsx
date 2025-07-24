// import React, { useState, useEffect } from "react";
// import { PlayCircle, Video } from "lucide-react";

// const LiveClasses = () => {
//     const classTime = new Date();
//     classTime.setHours(16, 0, 0); // Set class time to 4:00 PM

//     const [currentTime, setCurrentTime] = useState(new Date());
//     const [meetingLink, setMeetingLink] = useState(null); // Admin will set this link later

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setCurrentTime(new Date());
//         }, 1000);

//         return () => clearInterval(timer);
//     }, []);

//     const getClassStatus = () => {
//         if (currentTime < classTime) {
//             return "Class will start at 4:00 PM";
//         } else {
//             return "Class is now pending";
//         }
//     };

//     return (
//         <div className="flex justify-center items-center h-screen gap-6 border-4">
//             <div className="w-80 p-6 bg-white shadow-xl rounded-xl text-center border border-gray-200 hover:shadow-2xl transition">
//                 <div className="flex justify-center mb-4">
//                     <PlayCircle className="text-red-500 w-12 h-12" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-purple-600">Live Classes</h3>
//                 <p className="text-gray-600 mt-2">Interactive live sessions with expert teachers on Google Meet.</p>
//                 <p className="text-blue-600 font-semibold mt-2">{getClassStatus()}</p>

//                 {meetingLink && (
//                     <a href={meetingLink} target="_blank" rel="noopener noreferrer">
//                         <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition flex items-center justify-center gap-2">
//                             <Video className="w-5 h-5" /> Join on Google Meet
//                         </button>
//                     </a>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default LiveClasses;

import React, { useState, useEffect } from "react";
import { PlayCircle, Video } from "lucide-react";

const LiveClasses = () => {
    const classTime = new Date();
    classTime.setHours(16, 0, 0); // Class time 4:00 PM set kiya

    const [meetingLink, setMeetingLink] = useState(null); // Admin sets the link

    // ✅ Fetch meeting link from backend
    useEffect(() => {
        const fetchMeetingLink = async () => {
            try {
                const response = await fetch("http://localhost:5000/liveClasses/latest"); // Fetch latest meeting link
                const data = await response.json();
                setMeetingLink(data.meetLink);
            } catch (error) {
                console.error("❌ Error fetching meeting link:", error);
            }
        };

        fetchMeetingLink();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen gap-6 border-4">
            <div className="w-80 p-6 bg-white shadow-xl rounded-xl text-center border border-gray-200 hover:shadow-2xl transition">
                <div className="flex justify-center mb-4">
                    <PlayCircle className="text-red-500 w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold text-purple-600">Live Classes</h3>
                <p className="text-gray-600 mt-2">Interactive live sessions with expert teachers on Google Meet.</p>

                {meetingLink ? (
                    <a href={meetingLink} target="_blank" rel="noopener noreferrer">
                        <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition flex items-center justify-center gap-2">
                            <Video className="w-5 h-5" /> Join on Google Meet
                        </button>
                    </a>
                ) : (
                    <p className="text-red-500 mt-4">🔴Class is panding now</p>
                )}
            </div>
        </div>
    );
};

export default LiveClasses;

