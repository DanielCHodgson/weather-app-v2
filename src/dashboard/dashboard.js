import htmlString from "./dashboard.html";
import "./dashboard.css";
import DomUtility from "../utilities/DomUtility";
import CurrentForecastWidget from "../components/current-forecast-widget/current-forecast-widget";
import HourlyForecastWidget from "../components/hourly-forecast-widget/hourly-forecast-widget";

export default class Dashboard {
  #container;
  #element;
  #currentWeather;
  #hourlyWeather;

  constructor(container) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.init();
    this.render();
  }

  init() {
    this.#currentWeather = new CurrentForecastWidget(this.#element);
    this.#hourlyWeather = new HourlyForecastWidget(this.#element);
  }

  render() {
    this.#container.appendChild(this.#element);
  }

  getCurrentWeatherComponent() {
    return this.#currentWeather;
  }
}
