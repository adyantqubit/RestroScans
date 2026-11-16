export function kotDateTime(format) {
  return {
    date: format.substring(0, 10),
    time: format.substring(11, 16),
  };
}
