import htmlString from "./fortnightly-forecast-widget.html";
import "./fortnightly-forecast-widget.css";
import ForecastTile from "./forecast-tile/forecast-tile";
import DomUtility from "../../utilities/DomUtility";

export default class FortnightlyForecastWidget {
  #weatherDataService;
  #container;
  #element;
  #tiles = [];

  constructor(weatherDataService, container) {
    this.#weatherDataService = weatherDataService;
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.addTiles();
    this.render();
  }

  cacheFields() {
    return {};
  }

  async addTiles() {
    const data = await this.#weatherDataService.getAllData();

    data.days.forEach((forecast) =>
      this.#tiles.push(new ForecastTile(forecast, this.#element)),
    );
  }

  renderTiles() {
    this.#tiles.forEach((tile) => tile.render());
  }

  render() {
    this.renderTiles();
    this.#container.appendChild(this.#element);
  }
}
