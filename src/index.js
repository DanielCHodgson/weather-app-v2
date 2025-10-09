import CurrentForecastWidget from "./components/current-forecast-widget/current-forecast-widget";
import FortnightlyForecastWidget from "./components/fortnightly-forecast-widget/fortnightly-forecast-widget";
import LocationService from "./services/LocationService";
import WeatherAPI from "./services/WeatherAPI";
import WeatherDataService from "./services/WeatherDataService";
import "./styles/reset-modern.css";
import "./styles/styles.css";

const weatherAPI = new WeatherAPI();
const locationService = new LocationService();
const weatherDataService = new WeatherDataService(weatherAPI, locationService);

const currentForecast = new CurrentForecastWidget(
  weatherDataService,
  document.querySelector("body"),
);
const fortnightlyForecast = new FortnightlyForecastWidget(
  weatherDataService,
  document.querySelector("body"),
);

async function printAllWeatherData() {
  const data = await weatherDataService.getAllData();
  console.log(data);
}

printAllWeatherData();
