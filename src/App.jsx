import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadPage from './components/UploadPage';
import VideoLibraryPage from './components/VideoLibraryPage';
import VideoAnalyzerPage from './components/VideoAnalyzerPage';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage'; // Import the LandingPage component
import VideoAnalysisPage from './components/VideoAnalysisPage'; // Import the VideoAnalysisPage component

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />
        <div className="body-content">
          <Routes>
            <Route path="/" element={<LandingPage />} /> {/* Add the LandingPage component at the root path */}
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/library" element={<VideoLibraryPage />} />
            <Route path="/analyze/:videoId" element={<VideoAnalysisPage />} /> {/* Updated to use VideoAnalysisPage */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;