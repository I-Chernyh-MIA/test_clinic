const DATE_PATTERN = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
const TIME_PATTERN = /^([0-9]{2}):([0-9]{2})$/;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const SLOT_LENGTH_IN_MINUTES = 30;

function parseDate(value: string, parameterName: string) {
  if (typeof value !== "string") {
    throw new TypeError(`${parameterName} must be a string in YYYY-MM-DD format`);
  }

  const match = DATE_PATTERN.exec(value);
  if (match === null) {
    throw new RangeError(`${parameterName} must use YYYY-MM-DD format`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  if (
    year === 0 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new RangeError(`${parameterName} must be a valid calendar date`);
  }

  return date.getTime();
}

function parseTime(value: string, parameterName: string) {
  if (typeof value !== "string") {
    throw new TypeError(`${parameterName} must be a string in HH:MM format`);
  }

  const match = TIME_PATTERN.exec(value);
  if (match === null) {
    throw new RangeError(`${parameterName} must use HH:MM format`);
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) {
    throw new RangeError(`${parameterName} must be a valid 24-hour time`);
  }

  return hour * 60 + minute;
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function formatTime(totalMinutes: number) {
  const hour = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minute = String(totalMinutes % 60).padStart(2, "0");
  return `${hour}:${minute}`;
}

/**
 * Generate 30-minute time slots for every date in an inclusive date range.
 *
 * Dates use YYYY-MM-DD and times use HH:MM.
 */
export function generateTimeSlots(startDate: string, endDate: string, startTime: string, endTime: string) {
  const firstDate = parseDate(startDate, "startDate");
  const lastDate = parseDate(endDate, "endDate");
  const firstMinute = parseTime(startTime, "startTime");
  const lastMinute = parseTime(endTime, "endTime");

  if (firstDate > lastDate) {
    throw new RangeError("startDate must not be after endDate");
  }

  if (firstMinute > lastMinute) {
    throw new RangeError("startTime must not be after endTime");
  }

  if ((lastMinute - firstMinute) % SLOT_LENGTH_IN_MINUTES !== 0) {
    throw new RangeError("The time range must be divisible into 30-minute slots");
  }

  const slots = [];

  for (
    let currentDate = firstDate;
    currentDate <= lastDate;
    currentDate += DAY_IN_MILLISECONDS
  ) {
    const slotDate = formatDate(currentDate);

    for (
      let minute = firstMinute;
      minute < lastMinute;
      minute += SLOT_LENGTH_IN_MINUTES
    ) {
      slots.push({
        slotDate: new Date(slotDate),
        startTime: new Date(`${slotDate} ${formatTime(minute)}`),
        endTime: new Date(`${slotDate} ${formatTime(minute + SLOT_LENGTH_IN_MINUTES)}`),
      });
    }
  }

  return slots;
}