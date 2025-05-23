import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const states = [
  { name: "Johor", lat: 1.4854, lon: 103.7618, weather: "rain" },
  { name: "Kedah", lat: 6.1184, lon: 100.3682, weather: "sunny" },
  { name: "Kelantan", lat: 6.1254, lon: 102.2381, weather: "cloudy" },
  { name: "Malacca", lat: 2.1896, lon: 102.2501, weather: "sunny" },
  { name: "Negeri Sembilan", lat: 2.7258, lon: 101.9424, weather: "rain" },
  { name: "Pahang", lat: 3.8126, lon: 103.3256, weather: "cloudy" },
  { name: "Penang", lat: 5.4164, lon: 100.3327, weather: "sunny" },
  { name: "Perak", lat: 4.5975, lon: 101.0901, weather: "rain" },
  { name: "Perlis", lat: 6.4441, lon: 100.1986, weather: "cloudy" },
  { name: "Sabah", lat: 5.9788, lon: 116.0753, weather: "sunny" },
  { name: "Sarawak", lat: 1.5533, lon: 110.3592, weather: "cloudy" },
  { name: "Selangor", lat: 3.0738, lon: 101.5183, weather: "rain" },
];

const getWeatherEmoji = (type) => {
  switch (type) {
    case "sunny": return "☀️";
    case "rain": return "🌧️";
    case "cloudy": return "☁️";
    default: return "❓";
  }
};

const WeatherPage = () => {
  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>🌦️ Malaysia Weather Map</h2>
      <MapContainer center={[4.2105, 101.9758]} zoom={6} style={{ height: '90vh', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {states.map(state => (
          <Marker
            key={state.name}
            position={[state.lat, state.lon]}
            icon={L.divIcon({
                html: `<div style="font-size: 32px;">${getWeatherEmoji(state.weather)}</div>`,
                iconSize: [48, 48],
                className: 'custom-icon',
            })}
            >
            <Popup>
                <b>{state.name}</b><br />
                Weather: {state.weather}
            </Popup>
            </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default WeatherPage;
