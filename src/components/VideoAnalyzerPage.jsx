import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoMetadataSidebar from './VideoMetadataSidebar';
import '../assets/styles/VideoAnalysisPage.css';

function VideoAnalyzerPage() {
  let { videoId } = useParams();
  const [metadata, setMetadata] = useState(null);
  const [summary, setSummary] = useState('');
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch video metadata immediately
    axios.get(`http://localhost:8000/api/video-metadata/${videoId}`)
      .then(response => {
        setMetadata(response.data);
        setIsLoadingMetadata(false);
      })
      .catch(err => {
        console.error('Failed to fetch video metadata:', err);
        setError('Failed to fetch video metadata');
        setIsLoadingMetadata(false);
      });

    // Fetch video summary
    axios.get(`http://localhost:8000/api/analyze-video/${videoId}`)
      .then(response => {
        setSummary(response.data.summary);
        setIsLoadingSummary(false);
      })
      .catch(err => {
        console.error('Failed to fetch video summary:', err);
        setError('Failed to fetch video summary');
        setIsLoadingSummary(false);
      });
  }, [videoId]);

  if (isLoadingMetadata && isLoadingSummary) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="video-analysis-page">
      {!isLoadingMetadata && metadata && (
        <VideoMetadataSidebar metadata={metadata} />
      )}
      <div className="video-summary">
        {isLoadingSummary ? <p>Loading summary...</p> : <p>{summary}</p>}
      </div>
    </div>
  );
}

export default VideoAnalyzerPage;