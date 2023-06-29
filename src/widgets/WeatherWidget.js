import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    /* Function to fetch current weather data from the openweathermap API */
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather?q={YOUR CITY}&appid={YOUR OPENWEATHERMAP API KEY}"
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    /* Function to fetch forecast weather data from the openweathermap API */
    const fetchForecastData = async () => {
      try {
        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/forecast?q={YOUR CITY}&appid={YOUR OPENWEATHERMAP API KEY}"
        );
        const forecastList = response.data.list;
        const tomorrowForecast = forecastList.find((forecast) => {
          const forecastDate = new Date(forecast.dt_txt);
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          return forecastDate.getTime() >= tomorrow.getTime();
        });
        setForecastData(tomorrowForecast);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    /* function call to invoke fetchWeatherData */
    fetchWeatherData();
    /* function call to invoke fetchForecastData */
    fetchForecastData();
  }, []);

  /* Function to convert temperature provided by API from kelvin to celsius */
  const formatTemperature = (kelvin) => {
    const celsius = kelvin - 273.15;
    return `${celsius.toFixed(1)}°C`;
  };

  /* Function to add emoji to the weather based on its description */
  const getWeatherEmoji = (weatherDescription) => {
    const description = weatherDescription.toLowerCase();
    if (description.includes("clear")) {
      return "☀️";
    } else if (description.includes("clouds")) {
      return "☁️";
    } else if (description.includes("rain")) {
      return "🌧️";
    } else if (description.includes("thunderstorm")) {
      return "⛈️";
    } else if (description.includes("snow")) {
      return "❄️";
    } else {
      return "❓";
    }
  };

  /* Fuction to remove time from the forecast provide by the API */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="weather_widget">
      <div>
        <h2
          style={{
            marginBottom: "7px",
            fontWeight: "700",
          }}
        >
          Current Weather
        </h2>
        {weatherData && (
          <div>
            <p>City: {weatherData.name}</p>
            <p>Temperature: {formatTemperature(weatherData.main.temp)}</p>
            <p>
              Weather: {weatherData.weather[0].description}{" "}
              {getWeatherEmoji(weatherData.weather[0].description)}
            </p>
          </div>
        )}
      </div>

      <div className="vertical-line"></div>

      <div>
        <h3
          style={{
            marginBottom: "7px",
            fontWeight: "700",
          }}
        >
          Tomorrow Forecast{" "}
        </h3>
        {forecastData && (
          <div>
            <p>Date: {formatDate(forecastData.dt_txt)}</p>
            <p>Temperature: {formatTemperature(forecastData.main.temp)}</p>
            <p>
              Weather: {forecastData.weather[0].description}{" "}
              {getWeatherEmoji(forecastData.weather[0].description)}
            </p>
          </div>
        )}
      </div>

      {!weatherData && !forecastData && <p>Loading weather data...</p>}
    </div>
  );
};

export default WeatherWidget;
