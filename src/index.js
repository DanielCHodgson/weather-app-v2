import CurrentForecastWidget from "./components/current-forecast-widget/current-forecast-widget";
import LocationService from "./services/LocationService";
import WeatherAPI from "./services/WeatherAPI";
import WeatherDataService from "./services/WeatherDataService";
import "./styles/reset-modern.css";
import "./styles/styles.css";

const weatherAPI = new WeatherAPI();
const locationService = new LocationService();
const weatherDataService = new WeatherDataService(weatherAPI, locationService);

weatherDataService.getAllData();

const currentForecastWidget = new CurrentForecastWidget(document.querySelector("body"));