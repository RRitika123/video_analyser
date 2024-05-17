import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoMetadataSidebar from './VideoMetadataSidebar'; // Import the VideoMetadataSidebar component
import formatDuration from '../utils/formatDuration'; // Import the formatDuration utility function
import '../assets/styles/VideoAnalysisPage.css'; // Import the CSS for styling

function VideoAnalysisPage() {
  const { videoId } = useParams();
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState('');
  const [videoMetadata, setVideoMetadata] = useState({});
  const [summary, setSummary] = useState('');
  const [summaryError, setSummaryError] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(true); // Initialize summaryLoading to true as we will load it immediately

  useEffect(() => {
    const fetchVideoMetadata = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/video/metadata/${videoId}`);
        setVideoMetadata(response.data);
        setVideoLoading(false);
      } catch (err) {
        console.error("Error fetching video metadata:", err);
        setVideoError('Failed to fetch video metadata');
        setVideoLoading(false);
      }
    };

    const fetchSummary = async () => {
      setSummaryLoading(true); // Set loading state before fetching
      try {
        const response = await axios.get(`http://localhost:8000/api/analyze-video/${videoId}`);
        setSummary(response.data.summary);
        setSummaryLoading(false);
      } catch (err) {
        console.error("Error fetching video summary:", err);
        setSummaryError('Failed to fetch video summary');
        setSummaryLoading(false);
      }
    };

    fetchVideoMetadata();
    fetchSummary();
  }, [videoId]);

  if (videoLoading || summaryLoading) return <div>Loading...</div>;
  if (videoError || summaryError) return <div>Error: {videoError || summaryError}</div>;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <VideoMetadataSidebar 
            title={videoMetadata.title} 
            uploadDate={videoMetadata.upload_date} 
            fileSize={videoMetadata.file_size} 
            thumbnail={videoMetadata.thumbnail_path} // Corrected to use thumbnail_path from videoMetadata
            duration={formatDuration(videoMetadata.duration)} // Pass the formatted duration to the VideoMetadataSidebar
          />
        </div>
        <div className="col-md-9">
          <h4>Summary</h4>
          <div className="tab-content" id="analysisTabsContent">
            <div className="tab-pane fade show active" id="summary" role="tabpanel" aria-labelledby="summary-tab">
              <div className="summary-section">
                {summaryLoading ? <p>Loading summary...</p> : summaryError ? <p>Error loading summary: {summaryError}</p> : summary ? <p>{summary}</p> : <p>No summary available.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoAnalysisPage;