from flask_uploads import UploadSet, configure_uploads, VIDEO

videos = UploadSet('videos', VIDEO)

def configure_uploads_app(app):
    try:
        configure_uploads(app, videos)
        app.logger.info("Uploads configuration successful.")
    except Exception as e:
        app.logger.error(f"Failed to configure uploads: {e}\n{e.__traceback__}")