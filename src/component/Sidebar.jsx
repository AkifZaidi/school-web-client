import { LogOut } from 'lucide-react';
import React, { useState } from 'react'
import axios from "axios"
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {

  const { user, setUser } = React.useContext(UserDataContext);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const userLogoutHandler = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/logout`, {
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

  return (
    <div
      className={`fixed top-0 right-0 flex flex-col items-center w-1/2 h-full bg-white shadow-lg transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 z-50`}
    >
      <button className="text-black text-center text-2xl p-4" onClick={toggleSidebar}>&times;</button>
      <ul className="flex flex-col items-center mt-10 space-y-9 text-2xl">
        <li className='hover:text-red-500 hover:transition-transform duration-700 hover:tracking-wider'><Link to="/" onClick={toggleSidebar}>Home</Link></li>
        <li className='hover:text-red-500 hover:transition-transform duration-700 hover:tracking-wider'><Link to="/about" onClick={toggleSidebar}>About</Link></li>
        <li className='hover:text-red-500 hover:transition-transform duration-700 hover:tracking-wider'><Link to={token ? "/recorded-lectures" : "/login"} onClick={toggleSidebar}>Courses</Link></li>
        <li className='hover:text-red-500 hover:transition-transform duration-700 hover:tracking-wider'><Link to="/contact" onClick={toggleSidebar}>Contact</Link></li>
        <div className="flex flex-col space-y-4">
          {
            user ? (<button
              className="w-full flex items-center gap-3 bg-red-500 text-white py-2 px-3 rounded-full hover:bg-red-600"
              onClick={userLogoutHandler}
            >
              <LogOut size={20} /> Logout
            </button>) :
              (
                <>
                  <Link to='/login' className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600" onClick={toggleSidebar}> Login</Link>
                  <Link to="/signup" className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600" onClick={toggleSidebar}>Signup</Link>
                </>
              )
          }
        </div>
      </ul>
    </div>
  );
};

export default Sidebar
