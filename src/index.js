import LocationService from "./services/LocationService";
import WeatherAPI from "./services/WeatherAPI";
import WeatherDataService from "./services/WeatherDataService";
import "./styles/reset-modern.css";
import "./styles/styles.css";

const weatherAPI = new WeatherAPI();
const locationService = new LocationService();
const weatherDataService = new WeatherDataService(weatherAPI, locationService);

weatherDataService.getDailyForecast();
