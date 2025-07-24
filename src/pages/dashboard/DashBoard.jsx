import React, { useState, useEffect } from "react";
import {
    HomeIcon, Users2, Video, BarChart2Icon, Book, Bell, Settings2, LogOut, Edit, Trash2, UserPlus,
    MenuIcon,
    SidebarClose,
    SidebarCloseIcon,
    SquareX
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LiveClasses from "./LiveClasses";
import RecordedLectures from "./RecordedLectures";
import { UserDataContext } from "../../context/UserContext";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [sidebar, setSidebar] = useState(true);  // ✅ New state
    const [users, setUsers] = useState([]);
    const [links, setLinks] = useState([]);
    const [sessions, setSessions] = useState(0);
    const navigate = useNavigate();
    const { user, setUser } = React.useContext(UserDataContext);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/users/all-users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Fetched Users:", response.data); // ✅ Debugging

                setUsers(response.data.users || []); // ✅ Ensure array format
                setLinks(response.data.links || []); // ✅ Ensure array format
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]); // ✅ Default empty array on error
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/stats/sessions'); // 🔹 Backend API call
                setSessions(response.data.sessions);  // 🔹 Store in state
            } catch (error) {
                console.error("Error fetching active sessions:", error);
            }
        };

        fetchSessions();
    }, []);

    const menuItems = [
        { id: "dashboard", name: "Dashboard Overview", icon: <HomeIcon size={20} /> },
        { id: "users", name: "Manage Users", icon: <Users2 size={20} /> },
        { id: "live", name: "Live Classes", icon: <Video size={20} /> },
        { id: "lectures", name: "Recorded Lectures", icon: <Book size={20} /> },
    ];

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await axios.delete(`http://localhost:5000/users/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ Remove user from UI after successful backend deletion
            setUsers(users.filter(user => user._id !== id));

        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Please try again.");
        }
    };

    const userLogoutHandler = () => {
        const token = localStorage.getItem('token');
        axios.get("http://localhost:5000/users/logout", {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                localStorage.removeItem('token')
                setUser(null);
                navigate("/");
            }

        }).catch(error => {
            console.error("Logout failed", error);
        });
        // localStorage.removeItem('token');
        // navigate('/');
    }

    const menuToggle = () => {
        setSidebar(!sidebar);
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <motion.aside initial={{ x: -200 }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 100 }} className={`${sidebar ? 'w-64' : 'w-16'} bg-white shadow-lg p-3 flex flex-col justify-between`}>
                <div>
                    <div className="flex items-center justify-between -gap-10 mb-10">
                        <h2 className={`${sidebar ? 'block' : 'hidden'} text-2xl font-bold text-red-600`}>Admin Dashboard</h2>
                        <MenuIcon size={30} className={`${!sidebar ? 'block' : 'hidden'}  text-red-600 cursor-pointer mt-5 ml-1.5`} onClick={menuToggle} />
                        <SquareX size={30} className={`${!sidebar ? 'hidden' : 'block'}  text-red-600 cursor-pointer mt-5`} onClick={menuToggle} />
                    </div>
                    <nav className="mt-10">
                        <ul className="space-y-4">
                            {menuItems.map((item) => (
                                <li key={item.id} className={`flex items-center gap-3 p-2 text-gray-700 rounded-md cursor-pointer ${activeTab === item.id ? "text-red-300" : "hover:bg-red-100"}`} onClick={() => setActiveTab(item.id)}>
                                    <span>
                                        {item.icon}
                                    </span>
                                    <span className={`${sidebar ? 'block' : 'hidden'}`}>
                                        {item.name}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <button className={`w-full flex items-center gap-3 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600`} onClick={userLogoutHandler}> <LogOut size={20} /> <span className={`${sidebar ? 'block' : 'hidden'}`}>Logout</span> </button>
            </motion.aside>

            <main className="flex-1 p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Panel</h1>
                {activeTab === "dashboard" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div className="p-5 bg-white shadow-md rounded-lg" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
                            <p className="text-2xl font-bold text-purple-500">{users.length}</p>
                        </motion.div>
                        <motion.div className="p-5 bg-white shadow-md rounded-lg" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <h3 className="text-xl font-semibold text-gray-700">Active Sessions</h3>
                            <p className="text-2xl font-bold text-green-500">{links.length}</p>
                        </motion.div>
                    </div>
                ) : activeTab === "users" ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white shadow-lg rounded-lg p-6"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Users</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="p-3 text-left text-gray-700">Name</th>
                                        <th className="p-3 text-left text-gray-700">Email</th>
                                        <th className="p-3 text-left text-gray-700">Role</th>
                                        <th className="p-3 text-center text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user._id} className="border-b hover:bg-gray-100">
                                                <td className="p-3">{user.username || "N/A"}</td>
                                                <td className="p-3">{user.email}</td>
                                                <td className="p-3">{user.role || "User"}</td>
                                                <td className="p-3 flex justify-center gap-3">
                                                    <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center p-4 text-gray-500">No users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : activeTab === "live" ? (
                    <LiveClasses />
                ) : activeTab === "lectures" ? (
                    <RecordedLectures />
                ) : (
                    <h2 className="text-2xl font-semibold">Coming Soon...</h2>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
