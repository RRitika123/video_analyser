import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function VideoAnalyzerPage() {
  let { videoId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [questionsAnswers, setQuestionsAnswers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/analyze-video/${videoId}`);
        setSummary(response.data.summary);
        // Assuming the API could be extended to return questions and answers in the future
        // setQuestionsAnswers(response.data.questions_answers || []);
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
      {summary && (
        <>
          <h3 className="text-xl mb-2">Summary</h3>
          <p>{summary}</p>
        </>
      )}
      {/* Assuming future extension for questions and answers */}
      {/* {questionsAnswers.length > 0 && (
        <>
          <h3 className="text-xl mb-2">Question & Answers</h3>
          <ul>
            {questionsAnswers.map((qa, index) => (
              <li key={index}>
                <strong>{qa.question}</strong>: {qa.answer}
              </li>
            ))}
          </ul>
        </>
      )} */}
    </div>
  );
}

export default VideoAnalyzerPage;