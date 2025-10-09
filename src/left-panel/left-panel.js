import htmlString from "./left-panel.html";
import "./left-panel.css";
import DomUtility from "../utilities/DomUtility";
import Search from "../components/search/search";
import FortnightlyForecastWidget from "../components/fortnightly-forecast-widget/fortnightly-forecast-widget";

export default class LeftPanel {
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

    new Search(this.#element);

    new FortnightlyForecastWidget(
      this.#weatherDataService,
      this.#element,
    );
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
