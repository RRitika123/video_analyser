import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOADS_DEFAULT_DEST = os.path.join(basedir, 'uploads')  # Sets the default upload destination path
    UPLOADS_DEFAULT_URL = 'http://localhost:8000/uploads/'  # URL to access uploaded files