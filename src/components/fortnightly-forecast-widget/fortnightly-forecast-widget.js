import htmlString from "./fortnightly-forecast-widget.html";
import "./fortnightly-forecast-widget.css";
import ForecastTile from "./forecast-tile/forecast-tile";
import DomUtility from "../../utilities/DomUtility";
import EventBus from "../../utilities/EventBus";

export default class FortnightlyForecastWidget {
  #container;
  #element;
  #tiles = [];

  constructor(container) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.addTiles();
    this.registerEvents();
    this.render();
  }

  registerEvents() {
    EventBus.on("locationUpdated", (data) => {
      this.setData(data.forecast);
    });
  }

  cacheFields() {
    return {};
  }

  addTiles() {
    for (let i = 0; i < 14; i++) {
      this.#tiles.push(new ForecastTile(this.#element, i));
    }
  }

  async setData(data) {
    for (let i = 0; i < 14; i++) {
      this.#tiles[i].setData(data[i]);
    }
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
