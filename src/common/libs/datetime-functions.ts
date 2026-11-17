/**
 * Возвращает переданную дату с началом дня 00:00:00.
 * Если дата не передана, то используется текущая.
 */
export function getStartOfTheDay(date: Date = new Date()) {
  const temp = date;
  temp.setUTCHours(0, 0, 0, 0);

  return temp;
}

/**
 * Возвращает дату в формате `YYYY-MM-DD`.
 * Если дата не передана, то используется текущая.
 */
export function getISODate(date: Date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/**
 * Возвращает время в формате `HH:mm:ss.SSS`.
 * Если дата не передана, то используется текущая.
 */
export function getISOTime(date: Date = new Date()) {
  return date.toISOString().slice(11, -1);
}

/**
 * Возвращает время в формате HH:mm:ss, отсекая миллисекунды и дату.
 * Если дата не передана, то используется текущая.
 */
export function getTime(date: Date = new Date()) {
  return getISOTime(date).slice(0, 8);
}
