import React, { useState } from 'react';
import axios from 'axios';

const TranscriptTab = ({ videoId }) => {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTranscript = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/analyze/transcript/${videoId}`);
      setTranscript(response.data.transcript);
      console.log(`Transcript fetched successfully for video ID: ${videoId}`);
    } catch (err) {
      setError('Failed to fetch transcript.');
      console.error(`Error fetching transcript for video ID: ${videoId}:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button className="btn btn-primary m-2" onClick={fetchTranscript} disabled={loading}>
        {loading ? 'Loading...' : 'Transcribe'}
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
      {transcript && <div className="card card-body mt-2">{transcript}</div>}
    </div>
  );
};

export default TranscriptTab;