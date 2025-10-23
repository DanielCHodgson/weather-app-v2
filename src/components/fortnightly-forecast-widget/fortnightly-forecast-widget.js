import htmlString from "./fortnightly-forecast-widget.html";
import "./fortnightly-forecast-widget.css";
import DailyForecastTile from "./daily-forecast-tile/daily-forecast-tile";
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

  addTiles() {
    for (let i = 0; i < 14; i++) {
      this.#tiles.push(new DailyForecastTile(this.#element, i));
    }
  }

  registerEvents() {
    EventBus.on("locationUpdated", () => {
      this.#tiles.forEach((tile) => tile.deselect());
    });

    EventBus.on("weatherUpdated", (data) => {
      this.setData(data.fortnight);
    });

    EventBus.on("daySubmitted", (dayIndex) => {
      this.#tiles.forEach((tile, idx) => {
        idx === dayIndex ? tile.select() : tile.deselect();
      });
    });
  }

  async setData(data) {
    for (let i = 0; i < this.#tiles.length; i++) {
      this.#tiles[i].setData(data[i]);
    }
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
