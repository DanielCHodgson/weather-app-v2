import htmlString from "./hourly-forecast-tile.html";
import "./hourly-forecast-tile.css";
import DomUtility from "../../../utilities/DomUtility";

export default class ForecastTile {
  #container;
  #element;
  #fields = {};

  constructor(container) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.#fields = this.cacheFields();
    this.render();
  }

  cacheFields() {
    return {
      temp: this.#element.querySelector(".temp"),
      icon: this.#element.querySelector(".icon"),
      time: this.#element.querySelector(".time"),
    };
  }

  async setData(data) {
    try {
      //this.#fields.temp.textContent = `${data.actual}°`;
      //this.#fields.time.textContent = this.#updateTime();
      //await this.#updateIcon(data.icon);
    } catch (error) {
      console.error("Failed to load tile data:", error);
      this.#fields.forEach((element) => {
        DomUtility.showFallbackText(element);
      });
    } finally {
      DomUtility.removeSkeleton(this.#element);
    }
  }

  #updateTime(data) {
    
  }

  async #updateIcon(data) {
    this.#fields.icon.src = await DomUtility.getAnimatedWeatherIcon(data.icon);
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
