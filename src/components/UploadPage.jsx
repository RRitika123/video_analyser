import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useDropzone } from 'react-dropzone';

function UploadPage() {
  const [file, setFile] = useState();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [videoId, setVideoId] = useState(null); // State to hold the video ID
  const [isUploaded, setIsUploaded] = useState(false); // State to manage upload status
  const [isLoading, setIsLoading] = useState(false); // Added isLoading state
  const [uploadProgress, setUploadProgress] = useState(0); // Added state for upload progress
  const navigate = useNavigate(); // Initialize useNavigate

  const onDrop = useCallback(acceptedFiles => {
    // Assuming only single file upload, take the first file from the accepted files array.
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) {
      setMessage('No file selected or file type is not supported.');
      return;
    }
    setFile(selectedFile);
    // Update the message to include the file name
    setMessage(`File ready for upload: ${selectedFile.name}`);
    setIsUploaded(false);
    setIsLoading(false);
    // Reset message and progress when new file is dropped
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'video/mp4',
    maxSize: 1000000000, // Example to limit size to ~1GB, adjust as needed
    onDropRejected: () => setMessage('File is too large or not a video. Please select a valid video file.')
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a video file.');
      return;
    }
    setIsLoading(true); // Set isLoading to true right before the upload starts
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted); // Update upload progress
        },
      };

      const response = await axios.post('http://localhost:8000/upload', formData, config);
      setMessage(response.data.message);
      setVideoId(response.data.videoId); // Correctly capture the video ID from the response
      setIsUploaded(true); // Set upload status to true
      console.log('Video uploaded successfully', response.data); // Log success message
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred during file upload.');
      console.error('Upload failed', error.response || error); // Log the entire error
    } finally {
      setIsLoading(false); // Reset isLoading to false after the upload completes or if an error occurs
    }
  };

  const handleAnalyzeClick = () => {
    navigate(`/analyze/${videoId}`); // Redirect to the analysis page
  };

  // Custom styling for the dropzone
  const dropzoneStyle = {
    border: '2px dotted #007bff', // Match analyze button color with dotted line
    padding: '20px',
    textAlign: 'center',
    borderRadius: '12px',
    cursor: 'pointer',
    backgroundColor: isDragActive ? '#f0f8ff' : 'white', // Change color on drag
    minHeight: '200px', // Ensure constant height
    width: '100%', // Ensure constant width
    height: '200px', // Ensure constant height
  };

  return (
    <div className="container p-4">
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" />
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'bg-light' : ''}`} style={dropzoneStyle}>
          <input {...getInputProps()} />
          <p>Drop a video here, or click to select video</p>
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Uploading...' : 'Upload'}</button>
        {isLoading && (
          <div className="progress">
            <div className="progress-bar" role="progressbar" style={{ width: `${uploadProgress}%` }} aria-valuenow={uploadProgress} aria-valuemin="0" aria-valuemax="100">{uploadProgress}%</div>
          </div>
        )}
        {isUploaded && videoId && <button type="button" onClick={handleAnalyzeClick} className="btn btn-success mt-3">Analyze</button>} {/* Conditionally render the Analyze button based on upload status and video ID presence and changed the button color to green */}
      </form>
      {message && <div className="mt-3 text-center text-danger">{message}</div>}
    </div>
  );
}

export default UploadPage;