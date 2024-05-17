import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import '../assets/styles/LandingPage.css'; // Corrected path to the CSS file

const LandingPage = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleTryNowClick = () => {
    navigate('/upload'); // Navigate to the '/upload' route
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1>AI Video Summarizer</h1>
        <div><button className="btn btn-outline-primary mt-3" onClick={handleTryNowClick}>Try Now</button> </div> {/* Add the Try Now button */}
      </div>
    </div>
  );
};

export default LandingPage;