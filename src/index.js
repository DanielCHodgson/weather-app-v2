import LocationService from "./services/LocationService";
import WeatherAPIService from "./services/WeatherAPIService";
import WeatherDataService from "./services/WeatherDataService";
import IndexedDBService from "./services/IndexedDBService";
import WeatherCacheService from "./services/WeatherCacheService";
import LeftPanel from "./left-panel/left-panel";
import Dashboard from "./dashboard/dashboard";
import WeatherController from "./controllers/WeatherController";
import "./styles/reset-modern.css";
import "./styles/styles.css";

const indexedDBService = new IndexedDBService();
const weatherCacheService = new WeatherCacheService(indexedDBService);
const locationService = new LocationService();
const weatherAPIService = new WeatherAPIService(weatherCacheService);
const weatherDataService = new WeatherDataService(
  weatherAPIService,
  locationService,
);

const leftPanel = new LeftPanel(document.querySelector(".app"));
const dashboard = new Dashboard(document.querySelector(".app"));

const weatherController = new WeatherController(weatherDataService);

weatherController.updateWeather(await locationService.getLocation());

async function printAllWeatherData() {
  const data = await weatherDataService.getAllData();
  console.log(data);
}

printAllWeatherData();
