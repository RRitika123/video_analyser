function formatDuration(input) {
  let seconds = parseInt(input, 10);
  if (isNaN(seconds)) {
    console.error(`formatDuration error: Invalid input '${input}'. Expected a number.`);
    return "00:00";
  }

  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

  if (hours > 0) {
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  } else {
    return `${paddedMinutes} mins ${paddedSeconds} secs`;
  }
}

export default formatDuration;