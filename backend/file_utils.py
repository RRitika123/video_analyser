import os
import logging
from flask import current_app
import subprocess
import time

def unlock_file_windows(filepath):
    """
    Attempts to unlock a file by killing the process that's locking it on Windows.
    This is a forceful approach and should be used with caution.
    """
    try:
        # Using Resource Kit tool 'handle.exe' to find the locking process
        cmd = f'handle.exe -nobanner "{filepath}"'
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        stdout, stderr = proc.communicate()

        # Extracting process ID from the command output
        lines = stdout.decode().split('\n')
        for line in lines:
            if filepath in line:
                parts = line.split()
                pid = parts[-1][:-1]  # Removing trailing colon
                # Killing the process
                subprocess.call(['taskkill', '/F', '/PID', pid])
                logging.info(f"Unlocked file {filepath} by killing process {pid}.")
                return True
    except Exception as e:
        logging.error(f"Failed to unlock file {filepath}: {e}", exc_info=True)
    return False

def check_and_release_file_lock(filepath):
    """
    Checks if a file at the given filepath is locked and attempts to release the lock.
    This function is specifically designed for Windows environments where file locking
    can prevent deletion of files.
    """
    if os.name == 'nt':  # Check if the operating system is Windows
        unlocked = unlock_file_windows(filepath)
        if not unlocked:
            logging.error(f"Failed to unlock file {filepath}. Retrying...")
            time.sleep(5)  # Wait for 5 seconds before retrying
            unlock_file_windows(filepath)  # Attempt to unlock the file again
    else:
        logging.info("File locking check skipped as the operating system is not Windows.")

def delete_video_file(filepath):
    """
    Deletes a video file at the specified filepath, ensuring any file locks are handled.
    """
    check_and_release_file_lock(filepath)
    try:
        os.remove(filepath)
        logging.info(f"Successfully deleted file: {filepath}")
    except FileNotFoundError:
        logging.warning(f"File not found, could not delete: {filepath}")
    except PermissionError as e:
        logging.error(f"PermissionError encountered while deleting file {filepath}: {e}", exc_info=True)
    except Exception as e:
        logging.error(f"Unexpected error during file deletion for {filepath}: {e}", exc_info=True)