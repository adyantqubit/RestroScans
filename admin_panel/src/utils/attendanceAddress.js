import React, { useEffect, useState } from 'react';
import { attendanceMapUrl } from './attendanceLocation';

// Public OpenStreetMap Nominatim endpoint: max one request per second.
// Cache results in memory so rerenders and pagination do not repeat lookups.
const addressCache = new Map();
let queue = Promise.resolve();
let lastRequest = 0;

function lookupAddress(latitude, longitude) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return Promise.resolve(null);
  }
  const key = `${lat.toFixed(6)},${lon.toFixed(6)}`;
  if (addressCache.has(key)) return addressCache.get(key);
  const task = queue.catch(() => {}).then(async () => {
    const delay = Math.max(0, 1100 - (Date.now() - lastRequest));
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
    lastRequest = Date.now();
    const params = new URLSearchParams({ lat: String(lat), lon: String(lon), format: 'json', addressdetails: '1', zoom: '18', 'accept-language': 'en' });
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Address lookup unavailable');
    const data = await response.json();
    return data.display_name || null;
  });
  queue = task.catch(() => {});
  addressCache.set(key, task);
  task.catch(() => addressCache.delete(key));
  return task;
}

export function AttendanceAddress({ latitude, longitude }) {
  const mapUrl = attendanceMapUrl(latitude, longitude);
  const [state, setState] = useState({ key: null, address: null, loading: false });
  const key = mapUrl ? `${latitude},${longitude}` : null;

  useEffect(() => {
    if (!key) return undefined;
    let active = true;
    lookupAddress(latitude, longitude)
      .then(address => { if (active) setState({ key, address, loading: false }); })
      .catch(() => { if (active) setState({ key, address: null, loading: false }); });
    return () => { active = false; };
  }, [key, latitude, longitude]);

  if (!mapUrl) return 'Unavailable';
  const loading = state.key !== key;
  return (
    <div style={{ minWidth: 185, maxWidth: 310 }}>
      <div style={{ overflowWrap: 'anywhere', lineHeight: 1.5 }}>
        {loading ? 'Finding address...' : state.address || 'Address unavailable'}
      </div>
      <a href={mapUrl} target="_blank" rel="noopener noreferrer">View on Map</a>
    </div>
  );
}
