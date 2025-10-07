import htmlString from "./forecast-tile.html";
import "./forecast-tile.css";

export default class ForecastTile {
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
