import htmlString from "./dashboard.html";
import "./dashboard.css";
import DomUtility from "../utilities/DomUtility";
import CurrentForecastWidget from "../components/current-forecast-widget/current-forecast-widget";

export default class Dashboard {
  #container;
  #element;
  #currentWeatherComponent;

  constructor(container) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.init();
    this.render();
  }

  init() {
    this.#currentWeatherComponent = new CurrentForecastWidget(this.#element);
  }

  render() {
    this.#container.appendChild(this.#element);
  }

  getCurrentWeatherComponent() {
    return this.#currentWeatherComponent;
  }
}
