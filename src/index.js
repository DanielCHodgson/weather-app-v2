import LocationService from "./services/LocationService";
import WeatherAPIService from "./services/WeatherAPIService";
import WeatherDataService from "./services/WeatherDataService";
import LeftPanel from "./left-panel/left-panel";
import Dashboard from "./dashboard/dashboard";
import WeatherController from "./controllers/WeatherController";
import "./styles/reset-modern.css";
import "./styles/styles.css";

const weatherAPI = new WeatherAPIService();
const locationService = new LocationService();
const weatherDataService = new WeatherDataService(weatherAPI, locationService);

const leftPanel = new LeftPanel(document.querySelector(".app"));
const dashboard = new Dashboard(document.querySelector(".app"));

const weatherController = new WeatherController(weatherDataService,);

weatherController.updateLocation(await locationService.getLocation());

async function printAllWeatherData() {
  const data = await weatherDataService.getAllData();
  console.log(data);
}

printAllWeatherData();
