import htmlString from "./dashboard.html";
import "./dashboard.css";
import DomUtility from "../utilities/DomUtility";
import CurrentForecastWidget from "../components/current-forecast-widget/current-forecast-widget";
import HourlyForecastWidget from "../components/hourly-forecast-widget/hourly-forecast-widget";
import ConditionTile from "../components/condition-tile/condition-tile";

export default class Dashboard {
  #container;
  #element;
  #currentWeather;
  #hourlyWeather;
  #windCondition;

  constructor(container) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.init();
    this.render();
  }

  init() {
    this.#currentWeather = new CurrentForecastWidget(this.#element.querySelector(".banner"));
    this.#hourlyWeather = new HourlyForecastWidget(this.#element.querySelector(".hourly"));
    this.#windCondition = new ConditionTile(this.#element.querySelector(".conditions"));
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
