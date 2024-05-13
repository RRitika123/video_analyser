from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os
from flask_uploads import UploadSet, configure_uploads, ALL, patch_request_class
from flask_cors import CORS  # Import CORS
import io
from moviepy.editor import VideoFileClip
from PIL import Image
from flask_migrate import Migrate
import time
import logging
from file_utils import delete_video_file  # Import the utility function for deleting video files safely
from video_to_audio import convert_video_to_audio, speech_to_text
from summarize_text import authenticate_client, summarize_text

app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask app
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOADED_VIDEOS_DEST'] = os.path.join(basedir, 'uploads/videos')  # Sets the default upload destination path for videos
app.config['UPLOADED_VIDEOS_URL'] = 'http://localhost:8000/uploads/videos/'  # URL to access uploaded videos

db = SQLAlchemy(app)

migrate = Migrate(app, db)

videos = UploadSet('videos', ALL)
configure_uploads(app, videos)
patch_request_class(app, size=None)  # Optionally set maximum file size, default is None for unlimited

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    filepath = db.Column(db.String(256), nullable=False)
    thumbnail_path = db.Column(db.String(256), nullable=True)
    unique_thumbnail_path = db.Column(db.String(256), nullable=True)  # New column for unique thumbnail path

    def __repr__(self):
        return f'<Video {self.title}>'

    def delete(self):
        try:
            delete_video_file(self.filepath)  # Use the utility function to safely delete the video file
            if self.thumbnail_path and os.path.exists(self.thumbnail_path):
                os.remove(self.thumbnail_path)
                app.logger.info(f'Deleted thumbnail file: {self.thumbnail_path}')
            if self.unique_thumbnail_path and os.path.exists(self.unique_thumbnail_path):
                os.remove(self.unique_thumbnail_path)
                app.logger.info(f'Deleted unique thumbnail file: {self.unique_thumbnail_path}')
            db.session.delete(self)
            db.session.commit()
            app.logger.info(f'Video {self.title} deleted successfully from the database.')
            return True
        except Exception as e:
            app.logger.error(f'Error deleting video {self.title}: {e}', exc_info=True)
            return False

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        app.logger.error('No video part in the request')
        return jsonify({'error': 'No video part in the request'}), 400
    file = request.files['video']
    title = request.form.get('title', 'Untitled Video')
    if file.filename == '':
        app.logger.error('No selected file')
        return jsonify({'error': 'No selected file'}), 400
    if file and videos.file_allowed(file, file.filename):
        try:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOADED_VIDEOS_DEST'], filename)
            file.save(file_path)  # Save the file to the filesystem
            # Generate thumbnail
            video_clip = VideoFileClip(file_path)
            frame = video_clip.get_frame(1)  # Get a frame at 1 second
            unique_thumbnail_filename = f'thumbnail_{int(time.time())}_{filename}.png'
            unique_thumbnail_path = os.path.join(app.config['UPLOADED_VIDEOS_DEST'], unique_thumbnail_filename)
            # Convert numpy array frame to an image and save
            new_frame_image = Image.fromarray(frame)
            new_frame_image.save(unique_thumbnail_path)
            new_video = Video(title=title, filepath=file_path, thumbnail_path=unique_thumbnail_path, unique_thumbnail_path=unique_thumbnail_path)
            db.session.add(new_video)
            db.session.commit()
            app.logger.info(f'Video uploaded successfully: {filename}')
            return jsonify({
                'message': 'Video uploaded successfully',
                'videoId': new_video.id,
                'video': {
                    'title': title,
                    'filename': filename,
                    'filepath': file_path,
                    'thumbnail_path': unique_thumbnail_path.replace(app.config['UPLOADED_VIDEOS_DEST'], app.config['UPLOADED_VIDEOS_URL']) if unique_thumbnail_path else None,
                    'unique_thumbnail_path': unique_thumbnail_path.replace(app.config['UPLOADED_VIDEOS_DEST'], app.config['UPLOADED_VIDEOS_URL']) if unique_thumbnail_path else None
                }
            }), 201
        except Exception as e:
            app.logger.error(f'Error uploading video: {e}', exc_info=True)
            return jsonify({'error': 'Error uploading video'}), 500
    else:
        app.logger.error('File type not allowed')
        return jsonify({'error': 'File type not allowed'}), 400

@app.route('/videos', methods=['GET'])
def get_videos():
    try:
        videos = Video.query.all()
        videos_data = [{
            'id': video.id,
            'title': video.title,
            'filepath': video.filepath,
            'thumbnail_path': video.thumbnail_path.replace(app.config['UPLOADED_VIDEOS_DEST'], app.config['UPLOADED_VIDEOS_URL']) if video.thumbnail_path else None,
            'unique_thumbnail_path': video.unique_thumbnail_path.replace(app.config['UPLOADED_VIDEOS_DEST'], app.config['UPLOADED_VIDEOS_URL']) if video.unique_thumbnail_path else None
        } for video in videos]
        app.logger.info('Fetched videos successfully')
        return jsonify(videos_data), 200
    except Exception as e:
        app.logger.error(f"Failed to fetch videos: {e}", exc_info=True)
        return jsonify({'error': 'Failed to fetch videos'}), 500

@app.route('/api/analyze-video/<int:video_id>', methods=['GET'])
def analyze_video_api(video_id):
    video = Video.query.get(video_id)
    if not video:
        return jsonify({'error': 'Video not found'}), 404
    
    try:
        # Convert video to audio
        audio_path = convert_video_to_audio(video.filepath)
        
        # Transcribe audio to text
        transcript_path = speech_to_text(audio_path)
        
        # Authenticate the client for text analytics
        client = authenticate_client()
        
        # Generate summary from transcription
        summary_text = summarize_text(client, transcript_path)
        return jsonify({'summary': summary_text}), 200
    except Exception as e:
        app.logger.error(f"Error analyzing video {video_id}: {e}", exc_info=True)
        return jsonify({'error': 'Failed to analyze video'}), 500

@app.route('/uploads/videos/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOADED_VIDEOS_DEST'], filename)

@app.route('/delete/<int:video_id>', methods=['DELETE'])
def delete_video(video_id):
    try:
        video = Video.query.get(video_id)
        if not video:
            app.logger.error(f'Video with ID {video_id} not found')
            return jsonify({'error': 'Video not found'}), 404
        if not video.delete():
            return jsonify({'error': 'Failed to delete the video. The file is currently locked or in use. Please try again later.'}), 423  # 423 Locked
        app.logger.info(f'Video {video.title} deleted successfully from the database.')
        return jsonify({'message': 'Video deleted successfully'}), 200
    except PermissionError as e:
        app.logger.error(f'PermissionError encountered while deleting video with ID {video_id}: {e}', exc_info=True)
        return jsonify({'error': 'The file is currently locked or in use. Please try again later.'}), 423
    except Exception as e:
        app.logger.error(f'Failed to delete video with ID {video_id}: {e}', exc_info=True)
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            app.run(debug=True, port=8000)
        except Exception as e:
            app.logger.error(f"Failed to start Flask application or initialize database: {e}", exc_info=True)