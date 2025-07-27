import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserDataContext } from '../../context/UserContext';

const Login = ({ isOpen, closeLogin }) => {
  const [errorMessage, setErrorMessage] = useState([]);  // ✅ Ensure this is always an array
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { user, setUser } = React.useContext(UserDataContext);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage([]);  // ✅ Reset errors before submitting

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login`, formData, {
        withCredentials: true
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      setUser(data.user);

      if (data.user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error('Login Error:', error);

      // ✅ Properly handle validation & single message errors
      if (error.response?.data?.errors) {
        setErrorMessage(error.response.data.errors); // Array of errors
      } else if (error.response?.data?.message) {
        setErrorMessage([{ msg: error.response.data.message }]); // Convert to array
      } else {
        setErrorMessage([{ msg: "Something went wrong!" }]); // Generic error
      }
    }
    setFormData({ email: '', password: '' });
  };

  return (
    <div className="fixed top-0 right-0 w-full h-full bg-white flex flex-col items-center justify-center transition-transform duration-300">
      {/* 🔹 Error Messages Section */}
      {errorMessage.length > 0 && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 w-80">
          <ul>
            {errorMessage.map((error, index) => (
              <li key={index} className="text-xl">{error.msg}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="login-form w-80 bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="form-title text-2xl mb-4">Login</h2>
          <input type="email" name='email' placeholder="Email" value={formData.email}
            onChange={handleChange} className="w-full p-2 mb-3 border rounded focus:ring-2 focus:ring-red-500 focus:outline-none" required />
          <input type="password" name='password' placeholder="Password" value={formData.password}
            onChange={handleChange} className="w-full p-2 mb-3 border rounded focus:ring-2 focus:ring-red-500 focus:outline-none" required />
          <button type='submit' className="w-full bg-red-500 text-white py-2 rounded">Login</button>
          <p className='mt-3'>Go to <Link className='text-blue-600 underline' to='/signup'>Signup</Link> before Login</p>
        </div>
      </form>
    </div>
  );
};

export default Login;
