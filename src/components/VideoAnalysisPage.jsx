import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SummaryTab from './SummaryTab';

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
    <div>
      <h3>Video Analysis</h3>
      <div>
        <strong>Title:</strong> {videoMetadata.title}
        <p>Upload Date: {videoMetadata.upload_date}</p>
        <p>File Size: {videoMetadata.file_size} bytes</p>
      </div>
      <div className="tab-content" id="analysisTabsContent">
        <div className="tab-pane fade show active" id="summary" role="tabpanel" aria-labelledby="summary-tab">
          <SummaryTab videoId={videoId} />
        </div>
      </div>
    </div>
  );
}

export default VideoAnalysisPage;