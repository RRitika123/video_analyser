import React, { useState } from 'react';
import axios from 'axios';

const SummaryTab = ({ videoId }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:8000/api/analyze-video/${videoId}`);
      setSummary(response.data.summary);
      console.log(`Summary fetched successfully for video ID: ${videoId}`);
    } catch (err) {
      setError('Failed to fetch summary.');
      console.error(`Error fetching summary for video ID: ${videoId}:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button className="btn btn-primary m-2" onClick={fetchSummary} disabled={loading}>
        {loading ? 'Loading...' : 'Summarize'}
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
      {summary && <div className="card card-body mt-2">{summary}</div>}
    </div>
  );
};

export default SummaryTab;