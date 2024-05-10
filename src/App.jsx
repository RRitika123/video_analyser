import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadPage from './components/UploadPage';
import VideoLibraryPage from './components/VideoLibraryPage';
import VideoAnalyzerPage from './components/VideoAnalyzerPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />
        <div className="body-content">
          <Routes>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/library" element={<VideoLibraryPage />} />
            <Route path="/analyze/:videoId" element={<VideoAnalyzerPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;