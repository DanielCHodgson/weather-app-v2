import htmlString from "./fortnightly-forecast-widget.html";
import "./fortnightly-forecast-widget.css";

export default class FortnightlyForecastWidget {
  #container;
  #element;

  constructor(container) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.render();
  }

  cacheFields() {
    return {};
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
