import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const weatherApiKey = "aaac0a28c51e4fce95374003251204"; // 用你自己的 API 密钥
const states = [
  { name: "Johor", lat: 1.4854, lon: 103.7618 },
  { name: "Kedah", lat: 6.1184, lon: 100.3682 },
  { name: "Kelantan", lat: 6.1254, lon: 102.2381 },
  { name: "Malacca", lat: 2.1896, lon: 102.2501 },
  { name: "Negeri Sembilan", lat: 2.7258, lon: 101.9424 },
  { name: "Pahang", lat: 3.8126, lon: 103.3256 },
  { name: "Penang", lat: 5.4164, lon: 100.3327 },
  { name: "Perak", lat: 4.5975, lon: 101.0901 },
  { name: "Perlis", lat: 6.4441, lon: 100.1986 },
  { name: "Sabah", lat: 5.9788, lon: 116.0753 },
  { name: "Sarawak", lat: 1.5533, lon: 110.3592 },
  { name: "Selangor", lat: 3.0738, lon: 101.5183 },
];

const getWeatherEmoji = (weatherDescription) => {
  const description = weatherDescription.toLowerCase();  // 转换为小写字母，统一处理

  if (description.includes("sunny") || description.includes("clear")) return "☀️";  // 如果包含 "sunny" 或 "clear"（晴朗）
  if (description.includes("cloudy") || description.includes("overcast") || description.includes("partly cloudy")) return "☁️";  // 包含 "cloudy", "overcast", 或 "partly cloudy"（多云）
  if (description.includes("rain") || description.includes("drizzle") || description.includes("showers")) return "🌧️";  // 包含 "rain", "drizzle", 或 "showers"（雨）
  if (description.includes("thunderstorm") || description.includes("storm")) return "⛈️";  // 包含 "thunderstorm" 或 "storm"（雷暴）
  if (description.includes("snow")) return "❄️";  // 包含 "snow"（雪）
  return "❓";  // 默认返回未知天气图标
};


const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const updatedStates = await Promise.all(
        states.map(async (state) => {
          try {
            // 使用州的经纬度获取天气数据
            const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${state.lat},${state.lon}`);
            const data = await res.json();

            // 确保 API 返回的数据结构正确
            if (data.current && data.current.temp_c !== undefined) {
              return {
                ...state,
                weather: getWeatherEmoji(data.current.condition.text),  // 使用新的 emoji 显示
                description: data.current.condition.text,
                temperature: data.current.temp_c,
              };
            } else {
              // 如果没有有效的数据，返回默认值
              return {
                ...state,
                weather: "❓",
                description: "No data available",
                temperature: "N/A",
              };
            }
          } catch (error) {
            console.error("Failed to fetch weather data for", state.name, error);
            return {
              ...state,
              weather: "❓",
              description: "Error fetching data",
              temperature: "N/A",
            };
          }
        })
      );
      setWeatherData(updatedStates);
    };
    fetchWeatherData();
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>🌦️ Malaysia Weather Map</h2>
      <MapContainer center={[4.2105, 101.9758]} zoom={6} style={{ height: '90vh', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {weatherData.map(state => (
          <Marker
            key={state.name}
            position={[state.lat, state.lon]}
            icon={L.divIcon({
                html: `<div style="font-size: 32px;">${state.weather}</div>`,
                iconSize: [48, 48],
                className: 'custom-icon',
            })}
          >
            <Popup>
              <b>{state.name}</b><br />
              Weather: {state.description}<br />
              Temperature: {state.temperature}°C
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default WeatherPage;
