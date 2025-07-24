import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';

const Features = () => {
  const { user } = React.useContext(UserDataContext);
  let token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleFeatureClick = (link) => {
    if (!token) {
      navigate('/login', { state: { redirectTo: link } });
    }else{
      navigate(link);
    }
  };

  return (
    <section className="py-16 bg-white flex flex-wrap justify-center gap-8">
      {[
        { title: "Live Classes", desc: "Interactive live sessions with expert teachers.", link: "/liveClasses" },
        { title: "Recorded Lectures", desc: "Access recorded lectures anytime for revision.", link: "/recorded-lectures" },
      ].map((feature, index) => (
        <div
          key={index}
          onClick={() => handleFeatureClick(feature.link)}
          className="w-80 p-6 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:scale-x-75 hover:transition-transform duration-700"
        >
          <h3 className="text-xl font-semibold text-purple-600">{feature.title}</h3>
          <p className="text-gray-600 mt-2">{feature.desc}</p>
        </div>
      ))}
    </section>
  );
};

export default Features;