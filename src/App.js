// import React, { useState, useContext, useEffect } from "react";
// import { Routes, Route, useLocation } from "react-router-dom";
// import axios from "axios";
// import Register from "./pages/register/Register";
// import Login from "./pages/login/Login";
// import Navbar from "./component/Navbar";
// import Sidebar from "./component/Sidebar";
// import Hero from "./component/Hero";
// import Features from "./component/Features";
// import Footer from "./component/Footer";
// import Liveclasses from "./pages/liveClasses/LiveClasses";
// import RecordedLectures from "./component/RecordLectures";
// import About from "./pages/about/About";
// import Contact from "./pages/contact/Contact";
// import Dashboard from "./pages/dashboard/DashBoard";
// import { UserDataContext } from "./context/UserContext";
// // import ProductedWrapperRoute from "./pages/productedWrapper/ProductedWrapperRoute";

// function App() {
//   const { user, setUser } = useContext(UserDataContext);
//   const location = useLocation(); // Current page ka path get karne ke liye

//   const hideNavbarFooter = location.pathname === "/login" || location.pathname === "/signup" || location.pathname.includes("/dashboard");

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [loginOpen, setLoginOpen] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     if (token) {
//       // ✅ Set Axios default Authorization header globally
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//       axios.get('http://localhost:5000/users/profile')
//         .then(response => {
//           setUser(response.data.user);
//           console.log("User Profile:", response.data.user); // ✅ Debugging log

//           if (response.data.user.role === 'admin') {
//             console.log("Setting role to admin...");
//           } else {
//             console.log("Setting role to user...");
//           }
//         })
//         .catch(error => {
//           console.log("Unauthorized, removing token...");
//           localStorage.removeItem("token");
//           localStorage.removeItem("role");
//           delete axios.defaults.headers.common['Authorization']; // ❌ Remove token if invalid
//           setUser(null);
//         });
//     }
//   }, [setUser]);



//   return (
//     <div className="flex flex-col min-h-screen">
//       {!hideNavbarFooter && (
//         <>
//           <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
//           <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} openLogin={() => setLoginOpen(true)} />
//         </>
//       )}

//       <div className="flex-grow">
//         <Routes>
//           <Route path="/" element={<>
//             <header className="text-center py-16 bg-gradient-to-r from-red-500 to-orange-400 text-white">
//               <h1 className="text-4xl font-bold mt-4">Welcome to <span className="text-yellow-300">{user?.username || 'School Name'}</span></h1>
//               <p className="text-xl mt-2">Your Gateway to Quality Online Education</p>
//             </header>
//             <Hero />
//             <Features />
//           </>} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/login" element={<Login isOpen={loginOpen} closeLogin={() => setLoginOpen(false)} />} />
//           <Route path="/signup" element={<Register />} />
//           <Route path="/liveClasses" element={<Liveclasses />} />
//           <Route path="/recorded-lectures" element={<RecordedLectures />} />
//           {/* <Route path="/dashboard/*" element={<ProductedWrapperRoute><Dashboard /></ProductedWrapperRoute>} /> */}
//           <Route path="/dashboard/*" element={<Dashboard />} />
//         </Routes>
//       </div>

//       {!hideNavbarFooter && <Footer />}
//     </div>
//   );
// }

// export default App;
import React, { useState, useContext, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import Hero from "./component/Hero";
import Features from "./component/Features";
import Footer from "./component/Footer";
import Liveclasses from "./pages/liveClasses/LiveClasses";
import RecordedLectures from "./component/RecordLectures";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Dashboard from "./pages/dashboard/DashBoard";
import ProductedWrapperRoute from "./pages/productedWrapper/ProductedWrapperRoute";
import { UserDataContext } from "./context/UserContext";

function App() {
  const { user, setUser } = useContext(UserDataContext);
  const location = useLocation();
  const navigate = useNavigate();

  const hideNavbarFooter = location.pathname === "/login" || location.pathname === "/signup" || location.pathname.includes("/dashboard");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      axios.get('http://localhost:5000/users/profile')
        .then(response => {
          setUser(response.data.user);
          console.log("User Profile:", response.data.user);

          const { role } = response.data.user;

          if (role === 'admin') {
            console.log("Admin detected, redirecting to dashboard...");
            navigate("/dashboard");
          }
        })
        .catch(error => {
          console.log("Unauthorized, removing token...");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        });
    }
  }, [setUser, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbarFooter && (
        <>
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} openLogin={() => setLoginOpen(true)} />
        </>
      )}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<>
            <header className="text-center py-16 bg-gradient-to-r from-red-500 to-orange-400 text-white">
              <h1 className="text-4xl font-bold mt-4">Welcome to <span className="text-yellow-300">{user?.username || 'Username'}</span></h1>
              <p className="text-xl mt-2">Your Gateway to Quality Online Education</p>
            </header>
            <Hero />
            <Features />
          </>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login isOpen={loginOpen} closeLogin={() => setLoginOpen(false)} />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/liveClasses" element={<Liveclasses />} />
          <Route path="/recorded-lectures" element={<RecordedLectures />} />
          {/* <Route path="/dashboard/*" element={<Dashboard />} /> */}
          <Route path="/dashboard/*" element={<ProductedWrapperRoute><Dashboard /></ProductedWrapperRoute>} />
        </Routes>
      </div>

      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;
