import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function VideoAnalyzerPage() {
  let { videoId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/analyze/${videoId}`);
        setAnalysisData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch analysis data:', err);
        setError('Failed to fetch analysis data');
        setIsLoading(false);
      }
    };

    fetchAnalysisData();
  }, [videoId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Video Analysis</h2>
      <p>Analyzing video ID: {videoId}</p>
      {analysisData && (
        <>
          <h3 className="text-xl mb-2">Summary</h3>
          <p>{analysisData.summary}</p>
          <h3 className="text-xl mb-2">Question & Answers</h3>
          <ul>
            {analysisData.questions_answers.map((qa, index) => (
              <li key={index}>
                <strong>{qa.question}</strong>: {qa.answer}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default VideoAnalyzerPage;