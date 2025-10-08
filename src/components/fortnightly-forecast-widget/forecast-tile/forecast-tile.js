import htmlString from "./forecast-tile.html";
import "./forecast-tile.css";
import DomUtility from "../../../utilities/DomUtility";

export default class ForecastTile {
  #weatherData;
  #container;
  #element;
  #fields = {};

  constructor(weatherData, container) {
    this.#weatherData = weatherData;
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.#fields = this.cacheFields();
    this.render();
  }

  cacheFields() {
    return {
      day: this.#element.querySelector(".day"),
      actual: this.#element.querySelector(".actual"),
      feelsLike: this.#element.querySelector(".feels-like"),
      icon: this.#element.querySelector(".icon"),
      conditions: this.#element.querySelector(".conditions"),
    };
  }

  async setData(data) {
    try {
      const data = await Promise(this.#weatherData);

      this.#updateDay(data);
      this.#updateForecast(data);
      await this.#updateIcon(data.icon);
    } catch (error) {
      console.error("Failed to load data:", error);
      DomUtility.showFallbackText([this.#fields.temp, this.#fields.description]);
    } finally {
      DomUtility.removeSkeletons(this.#fields);
    }
  }

  #updateDay(data) {

  }

  #updateForecast(data) {
    this.#fields.temp.textContent = `${data.temp}°`;
    this.#fields.description.textContent = data.conditions;
  }

  async #updateIcon(iconName) {
    this.#fields.icon.src = await DomUtility.getAnimatedWeatherIcon(iconName);
  }


  setWeatherIcon(iconToUse) {
    const src = DomUtility.getAnimatedWeatherIcon(iconToUse);
    this.#fields.icon.src = src;
  }
  render() {
    this.#container.appendChild(this.#element);
  }
}
