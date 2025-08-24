// src/context/useWeather.js 
import { useContext } from "react";
import { WeatherContext } from "./WeatherContext";

const useWeather = () => useContext(WeatherContext);

export default useWeather;