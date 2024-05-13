from moviepy.editor import VideoFileClip
import os
import sys
import logging
import azure.cognitiveservices.speech as speechsdk
import time

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def convert_video_to_audio(video_path):
    try:
        # Extract the filename without its extension
        base = os.path.basename(video_path)
        filename = os.path.splitext(base)[0]
        
        # Define the output audio file path
        output_audio_path = os.path.join(os.path.dirname(video_path), f"{filename}.wav")
        
        # Load the video file
        video = VideoFileClip(video_path)
        
        # Extract audio from the video and save it as a .wav file
        video.audio.write_audiofile(output_audio_path)
        
        logging.info(f"Successfully converted video to audio: {output_audio_path}")
        return output_audio_path
    except Exception as e:
        logging.error("Error converting video to audio: %s", e, exc_info=True)
        return None

def speech_to_text(audio_path):
    transcript_path = ""
    try:
        subscription_key = "b5bb7462d60742c9ae466067119f32ee"  # INPUT_REQUIRED {Azure Speech Service subscription key}
        region = "westus"  # INPUT_REQUIRED {Azure Speech Service region}
        if not subscription_key or not region:
            logging.error("Azure subscription key or region is not set.")
            return None

        speech_config = speechsdk.SpeechConfig(subscription=subscription_key, region=region)
        speech_config.speech_recognition_language="en-US"
        audio_config = speechsdk.audio.AudioConfig(filename=audio_path)
        
        speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

        done = False

        def stop_cb(evt):
            """Called when the single utterance is recognized"""
            speech_recognizer.stop_continuous_recognition()
            nonlocal done
            done = True

        def recognized_cb(evt):
            """Called when a final response is received"""
            nonlocal transcript_path
            # Extract the filename for the transcript
            base = os.path.basename(audio_path)
            filename = os.path.splitext(base)[0]
            transcript_path = os.path.join(os.path.dirname(audio_path), f"transcript_{filename}.txt")
            with open(transcript_path, 'a') as file:
                file.write(f"{evt.result.text}\n")
            logging.info(f"Transcription added to: {transcript_path}")

        speech_recognizer.recognized.connect(recognized_cb)
        speech_recognizer.session_stopped.connect(stop_cb)
        speech_recognizer.canceled.connect(stop_cb)

        speech_recognizer.start_continuous_recognition()
        while not done:
            time.sleep(.5)
        logging.info("Transcription completed successfully.")
        return transcript_path
    except Exception as e:
        logging.error("Failed to transcribe audio: %s", e, exc_info=True)
        return None

if __name__ == "__main__":
    if len(sys.argv) != 2:
        logging.error("Usage: python video_to_audio.py <path_to_video>")
        sys.exit(1)
    
    video_path = sys.argv[1]
    audio_path = convert_video_to_audio(video_path)
    if audio_path:
        transcript_path = speech_to_text(audio_path)
        if transcript_path:
            logging.info(f"Transcription and conversion completed successfully for {video_path}")
        else:
            logging.error("Failed to transcribe audio.")
    else:
        logging.error("Failed to convert video to audio.")