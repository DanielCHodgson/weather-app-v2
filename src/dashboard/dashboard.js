import htmlString from "./dashboard.html";
import "./dashboard.css";
import DomUtility from "../utilities/DomUtility";
import CurrentForecastWidget from "../components/current-forecast-widget/current-forecast-widget";

export default class Dashboard {
  #weatherDataService;
  #container;
  #element;

  constructor(weatherDataService, container) {
    this.#weatherDataService = weatherDataService;
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.init();
    this.render();
  }

  init() {
    new CurrentForecastWidget(this.#weatherDataService, this.#element);
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
