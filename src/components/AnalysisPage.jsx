import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AnalysisPage() {
    const { videoId } = useParams();
    const [analysis, setAnalysis] = useState({ summary: '', questions_answers: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:8000/api/analyze-video/${videoId}`)
            .then(response => {
                setAnalysis({ summary: response.data.summary, questions_answers: [] }); // Assuming the API only returns summary for now
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error retrieving the analysis data:', error);
                setError('Failed to fetch analysis data.');
                setLoading(false);
            });
    }, [videoId]);

    if (loading) {
        return <div className="container mt-5">Loading...</div>;
    }

    if (error) {
        return <div className="container mt-5">Error: {error}</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-3">Video Analysis Results</h2>
            <ul className="nav nav-tabs" id="analysisTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="summary-tab" data-bs-toggle="tab" data-bs-target="#summary" type="button" role="tab" aria-controls="summary" aria-selected="true">Summary</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="qa-tab" data-bs-toggle="tab" data-bs-target="#qa" type="button" role="tab" aria-controls="qa" aria-selected="false">Q&A</button>
                </li>
            </ul>
            <div className="tab-content" id="analysisTabContent">
                <div className="tab-pane fade show active" id="summary" role="tabpanel" aria-labelledby="summary-tab">
                    <div className="mt-3">
                        <h3>Summary</h3>
                        <p>{analysis.summary}</p>
                    </div>
                </div>
                <div className="tab-pane fade" id="qa" role="tabpanel" aria-labelledby="qa-tab">
                    <div className="mt-3">
                        <h3>Q&A</h3>
                        <ul>
                            {analysis.questions_answers.map((qa, index) => (
                                <li key={index}>
                                    <strong>Q:</strong> {qa.question}<br />
                                    <strong>A:</strong> {qa.answer}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnalysisPage;