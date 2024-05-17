import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SummaryTab from './SummaryTab';
import VideoMetadataSidebar from './VideoMetadataSidebar'; // Import the VideoMetadataSidebar component
import formatDuration from '../utils/formatDuration'; // Import the formatDuration utility function

function VideoAnalysisPage() {
  const { videoId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [videoMetadata, setVideoMetadata] = useState({});

  useEffect(() => {
    const fetchVideoMetadata = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/video/metadata/${videoId}`);
        setVideoMetadata(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching video metadata:", err);
        setError('Failed to fetch video metadata');
        setLoading(false);
      }
    };

    fetchVideoMetadata();
  }, [videoId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
          <div className="tab-content" id="analysisTabsContent">
            <div className="tab-pane fade show active" id="summary" role="tabpanel" aria-labelledby="summary-tab">
              <SummaryTab videoId={videoId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoAnalysisPage;