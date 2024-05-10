# Video Analyzer App

Video Analyzer is a comprehensive platform designed for uploading, storing, and analyzing video content. It enables users to upload videos in MP4 format, manage them in a video library, and utilize advanced analysis features such as summarization and question answering. The platform emphasizes ease of use with features like drag-and-drop upload functionality and a responsive design for seamless access across devices.

## Overview

The Video Analyzer app utilizes React for its frontend, providing a dynamic and responsive user interface. The backend is powered by Flask, offering robust server-side functionality, while SQLite is used for efficient data management and storage. The application is structured into separate modules for video upload, video library management, and video analysis, ensuring a user-friendly experience.

## Features

- **Video Upload**: Support for uploading videos in MP4 format, with drag-and-drop functionality and real-time upload status updates.
- **Video Library**: A comprehensive library displaying uploaded videos with thumbnails and options for further analysis or deletion.
- **Video Analysis**: Detailed analysis tools, including video summarization and question answering, available for each video in the library.
- **Responsive Design**: A fluid layout that adapts to various screen sizes, ensuring accessibility on desktops, tablets, and mobile devices.

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