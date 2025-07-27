import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../../context/UserContext';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState([]);  // 🔹 State for validation errors
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);  // 🔹 Reset errors before submitting

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/register`, formData, {
        withCredentials: true
      });

      if (response.status === 201) {
        console.log(response.data);
        const data = response.data;
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate('/');
      }

    } catch (error) {
      console.log(error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors); // Array of errors
      } else if (error.response?.data?.message) {
        setErrors([{ msg: error.response.data.message }]); // Convert to array
      } else {
        setErrors([{ msg: "Something went wrong!" }]); // Generic error
      }
    }
    setFormData({ username: '', email: '', password: '' });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
        {/* 🔹 Validation Errors Display */}
        {errors.length > 0 && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4  w-full max-w-lg">
            <ul>
              {errors.map((error, index) => (
                <li key={index} className="text-xl">{error.msg}</li>
              ))}
            </ul>
          </div>
        )}
      <div className="register-form p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="form-title text-3xl font-bold text-gray-800 text-center mb-8">Create an Account</h2>
        

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 transition duration-300">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
