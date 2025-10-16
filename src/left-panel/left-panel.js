import htmlString from "./left-panel.html";
import "./left-panel.css";
import DomUtility from "../utilities/DomUtility";
import Search from "../components/search/search";
import FortnightlyForecastWidget from "../components/fortnightly-forecast-widget/fortnightly-forecast-widget";

export default class LeftPanel {
  #container;
  #element;
  #searchComponent;
  #forecastComponent;

  constructor(container) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.init();
    this.render();
  }

  init() {
    this.#searchComponent = new Search(this.#element, "locationSubmitted");

    this.#forecastComponent = new FortnightlyForecastWidget(this.#element);
  }

  render() {
    this.#container.appendChild(this.#element);
  }

  getSearchComponent() {
    return this.#searchComponent;
  }

  getForecastComponent() {
    return this.#forecastComponent;
  }
}
