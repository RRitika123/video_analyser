import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VideoLibraryPage() {
  const [videos, setVideos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/videos');
        if (Array.isArray(response.data)) {
          setVideos(response.data);
          console.log('Fetched videos successfully.');
        } else {
          console.error('Fetched data is not an array:', response.data);
          setVideos([]); // Ensuring videos is always an array even if fetched data is not
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error.message, error.stack);
        setErrorMessage('Failed to fetch videos. Please try again later.');
      }
    };

    fetchVideos();
  }, []);

  const deleteVideo = async (videoId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/delete/${videoId}`);
      if (response.status === 200) {
        setVideos(videos.filter(video => video.id !== videoId));
        console.log(`Video with ID ${videoId} deleted successfully.`);
        setErrorMessage(''); // Clear any previous error messages
      } else {
        console.error('Failed to delete video:', response.data);
        setErrorMessage('Failed to delete video. Please try again later.');
      }
    } catch (error) {
      console.error('Error deleting video:', error.message, error.stack);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="container py-5">
      {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {videos.map((video, index) => (
          <div key={index} className="col">
            <div className="card h-100">
              <img
                src={video.thumbnail_path ? video.thumbnail_path : `https://placehold.co/300x200.png?text=No+Thumbnail`}
                alt={`Thumbnail for ${video.title}`}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{video.title}</h5>
                <a href={`/analyze/${video.id}`} className="btn btn-primary me-2">ANALYZE</a>
                <button onClick={() => deleteVideo(video.id)} className="btn btn-danger">DELETE</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoLibraryPage;