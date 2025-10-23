import htmlString from "./hourly-forecast-widget.html";
import "./hourly-forecast-widget.css";
import HourlyForecastTile from "./hourly-forecast-tile/hourly-forecast-tile";
import DomUtility from "../../utilities/DomUtility";
import EventBus from "../../utilities/EventBus";

export default class HourlyForecastWidget {
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
    EventBus.on("weatherUpdated", (data) => {
      this.setAllTileData(data.day);
    });
  }

  cacheFields() {
    return {};
  }

  addTiles() {
    for (let i = 0; i < 24; i++) {
      this.#tiles.push(new HourlyForecastTile(this.#element));
    }
  }

  async setAllTileData(data) {
    for (let i = 0; i < 24; i++) {
      this.#tiles[i].setData(data.hours[i]);
    }
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
