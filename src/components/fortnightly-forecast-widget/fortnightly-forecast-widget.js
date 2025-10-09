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
    this.render();
    this.addTiles();
    this.setTileData();
  }

  cacheFields() {
    return {};
  }

  addTiles() {
    for (let i = 0; i < 14; i++) {
      this.#tiles.push(new ForecastTile(this.#element));
    }
  }

  async setTileData() {
    const data = await this.#weatherDataService.getAllData();
    const days = data.days;

    for (let i = 0; i < 14; i++) {
      console.log(days[i]);
      this.#tiles[i].setData(days[i]);
    }
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
