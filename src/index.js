import LocationService from "./services/LocationService";
import WeatherAPIService from "./services/WeatherAPIService";
import WeatherDataService from "./services/WeatherDataService";
import LeftPanel from "./left-panel/left-panel";
import Dashboard from "./dashboard/dashboard";
import "./styles/reset-modern.css";
import "./styles/styles.css";

const weatherAPI = new WeatherAPIService();
const locationService = new LocationService();
const weatherDataService = new WeatherDataService(weatherAPI, locationService);

new LeftPanel(weatherDataService, document.querySelector("body"));
new Dashboard(weatherDataService, document.querySelector("body"));

async function printAllWeatherData() {
  const data = await weatherDataService.getAllData();
  console.log(data);
}

printAllWeatherData();
