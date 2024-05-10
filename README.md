# Video Analyzer App

Video Analyzer is a comprehensive platform designed for uploading, storing, and analyzing video content. It allows users to upload videos, view them in a video library, and perform detailed analyses, including summarization and question answering, on uploaded content.

## Overview

The Video Analyzer app leverages React for its frontend, ensuring a dynamic and responsive user experience. Flask is used for the backend, providing robust server-side functionalities. SQLite serves as the database, managing data storage and retrieval efficiently. The application architecture is modular, with separate pages for video upload, video library, and video analysis, including features such as drag-and-drop upload and real-time analysis results.

## Features

- **Video Upload**: Users can upload videos in MP4 format, either by selecting the file manually or using a drag-and-drop interface.
- **Video Library**: Uploaded videos are displayed with thumbnails, titles, and options for analysis or deletion.
- **Video Analysis**: Offers tools for summarizing the video content and answering specific questions related to the uploaded videos.
- **Responsive Design**: Ensures a seamless user experience across various devices and screen sizes.

## Getting Started

### Requirements

- Node.js
- npm or yarn
- Python 3
- Flask
- SQLite

### Quickstart

1. Clone the repository to your local machine.
2. Navigate to the project directory and install frontend dependencies using `npm install` or `yarn`.
3. Start the frontend development server with `npm run dev` or `yarn dev`.
4. In a separate terminal, navigate to the `backend` directory.
5. Install backend dependencies with `pip install -r requirements.txt`.
6. Start the Flask server using `python app.py`.
7. Access the application at `http://localhost:3000` in your web browser.

### License

Copyright (c) 2024.