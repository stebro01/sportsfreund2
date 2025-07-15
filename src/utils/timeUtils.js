/**
 * Format seconds to mm:ss format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  if (seconds >= 60) {
    const date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5);
  }
  return seconds.toString();
}

/**
 * Calculate total duration from program data
 * @param {Object|Array} data - Program data or array of steps
 * @param {number} progress - Current progress (optional, for timer calculations)
 * @returns {number} Total duration in seconds
 */
export function calcDuration(data, progress = 0) {
  let total = 0; // in seconds

  if (Array.isArray(data)) {
    if (data.length && data[0]._check !== undefined) {
      // Timer data array (with _check property)
      data.forEach((time) => {
        if (time._check === false) total += time.value;
      });
      total -= progress;
    } else {
      // Program steps array
      data.forEach((step) => {
        total += step.duration * (step.repetitions || 1);
      });
    }
  } else {
    // Program preset object
    const { action, break: _break, exercises, rounds, round_break } = data;
    const action_time = action.value * exercises.value * rounds.value;
    const break_time = _break.value * (exercises.value - 1) * rounds.value;
    const round_break_time = round_break.value * (rounds.value - 1);
    total = action_time + break_time + round_break_time;
  }

  return total;
}
