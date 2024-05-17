import React from 'react';
// Removed the import for formatDuration as it's no longer needed

const VideoMetadataSidebar = ({ title, uploadDate, fileSize, thumbnail, duration }) => {
    // Directly use the 'duration' prop value which is already provided in seconds
    const displayDuration = `${duration}`;

    return (
        <div className="sidebar d-flex flex-column p-3">
            <img src={thumbnail} alt="Video Thumbnail" className="mb-3" />
            <p className="mb-1"><strong>Title:</strong> {title}</p>
            <p className="mb-1"><strong>Upload Date:</strong> {uploadDate}</p>
            <p className="mb-1"><strong>File Size:</strong> {fileSize} KB</p>
            <p><strong>Duration:</strong> {displayDuration}</p> {/* Display duration in seconds */}
        </div>
    );
};

export default VideoMetadataSidebar;