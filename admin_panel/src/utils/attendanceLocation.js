// Capture location once at the moment of attendance. Permission denial never blocks check-in/out.
export function captureAttendanceLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation || !window.isSecureContext) {
      resolve({});
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      () => resolve({}),
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
    );
  });
}

export function AttendanceCoordinates({ latitude, longitude }) {
  if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) {
    return 'Unavailable';
  }
  const coordinates = `${Number(latitude).toFixed(6)}, ${Number(longitude).toFixed(6)}`;
  return coordinates;
}

export function attendanceMapUrl(latitude, longitude) {
  if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) return null;
  return `https://www.google.com/maps?q=${encodeURIComponent(`${latitude},${longitude}`)}`;
}
