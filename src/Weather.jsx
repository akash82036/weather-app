import { useState } from "react";
import axios from "axios";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiFog,
  WiThunderstorm,
} from "react-icons/wi";

function Weather() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city.trim()) return;

    setError("");
    setData(null);

    const apiKey = import.meta.env.VITE_WEATHER_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const res = await axios.get(url);
      setData(res.data);
      setCity("");
    } catch {
      setError("City not found");
    }
  };

  const getIcon = (main) => {
    switch (main) {
      case "Clear":
        return <WiDaySunny size={90} />;
      case "Clouds":
        return <WiCloudy size={90} />;
      case "Rain":
        return <WiRain size={90} />;
      case "Snow":
        return <WiSnow size={90} />;
      case "Thunderstorm":
        return <WiThunderstorm size={90} />;
      case "Mist":
      case "Haze":
      case "Fog":
        return <WiFog size={90} />;
      default:
        return <WiCloudy size={90} />;
    }
  };

  const getCityTime = () => {
    if (!data) return "";

    const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const cityTime = new Date(utcTime + data.timezone * 1000);

    return cityTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  return (
    <div className="app">
      <h1>Weather</h1>

      <div className="search">
        <input
          type="text"
          value={city}
          placeholder="Enter city"
          onChange={(e) => {
            const value = e.target.value.toLowerCase();
            setCity(value.charAt(0).toUpperCase() + value.slice(1));
          }}
          onKeyDown={(e) => e.key === "Enter" && getWeather()}
        />

        <button onClick={getWeather} disabled={!city.trim()}>
          Search
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {data && (
        <div className="weather">
          <p className="city">{data.name}</p>
          <p className="time">
            Local time: {getCityTime()}
          </p>

          <div className="icon">
            {getIcon(data.weather[0].main)}
          </div>

          <p className="temp">{Math.round(data.main.temp)}°C</p>
          <p className="desc">{data.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
