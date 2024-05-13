import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const VideoLibrary = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/videos');
        setVideos(response.data);
        console.log('Fetched videos successfully');
      } catch (error) {
        console.error('Failed to fetch videos:', error);
        setError('Failed to fetch videos.');
      }
    };

    fetchVideos();
  }, []);

  const deleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      setIsDeleting(true);
      try {
        await axios.delete(`http://localhost:8000/delete/${videoId}`);
        setVideos(videos.filter(video => video.id !== videoId));
        console.log(`Deleted video with ID: ${videoId} successfully`);
      } catch (error) {
        console.error('Failed to delete the video:', error);
        setError('Failed to delete the video.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Video Library</h1>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-4 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="bg-white p-4 shadow rounded">
              <img
                src={`http://localhost:8000/uploads/videos/${video.id}.png`} // Placeholder for video thumbnail
                alt={`Thumbnail for ${video.title}`}
                className="mb-4 w-full object-cover h-48"
              />
              <h3 className="text-gray-900 mb-3">{video.title}</h3>
              <Link to={`/analyze/${video.id}`} className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                ANALYZE
              </Link>
              <button onClick={() => deleteVideo(video.id)} className="ml-2 inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" disabled={isDeleting}>
                {isDeleting ? 'DELETING...' : 'DELETE'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoLibrary;