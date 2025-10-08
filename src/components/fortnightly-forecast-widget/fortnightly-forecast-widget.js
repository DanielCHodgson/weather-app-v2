import htmlString from "./fortnightly-forecast-widget.html";
import "./fortnightly-forecast-widget.css";
import ForecastTile from "./forecast-tile/forecast-tile"
import DomUtility from "../../utilities/DomUtility";

export default class FortnightlyForecastWidget {
  #container;
  #element;
  #tiles = [];

  constructor(container) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.addTiles();
    this.render();
  }

  cacheFields() {
    return {};
  }


  addTiles() {
    this.#tiles.push(new ForecastTile({}, this.#element));
  }

  renderTiles(){
    this.#tiles.forEach(tile => tile.render());
  }

  render() {
    this.renderTiles();
    this.#container.appendChild(this.#element);
  }
}
