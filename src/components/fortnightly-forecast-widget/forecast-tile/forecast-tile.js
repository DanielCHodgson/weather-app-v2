import htmlString from "./forecast-tile.html";
import "./forecast-tile.css";
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
      date: this.#element.querySelector(".date"),
      actual: this.#element.querySelector(".actual"),
      feelsLike: this.#element.querySelector(".feels-like"),
      icon: this.#element.querySelector(".icon"),
      conditions: this.#element.querySelector(".conditions"),
    };
  }

  async setData(data) {
    try {
      this.#updateDay(data);
      this.#updateForecast(data);
      await this.#updateIcon(data);
    } catch (error) {
      console.error("Failed to load tile data:", error);
      this.#fields.forEach((element) => {
        DomUtility.showFallbackText(element);
      });
    } finally {
      DomUtility.removeSkeleton(this.#element);
    }
  }

  #updateDay(data) {
    const date = new Date(data.datetime);
    const weekday = date.toLocaleDateString("en-UK", { weekday: "short" });
    const day = date.getDate();

    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    this.#fields.date.textContent = `${weekday} ${getOrdinal(day)}`;
  }

  #updateForecast(data) {
    this.#fields.actual.textContent = `${data.temp}°`;
    this.#fields.feelsLike.textContent = `${data.feelslike}°`;
    this.#fields.conditions.textContent = data.conditions;
  }

  async #updateIcon(data) {
    this.#fields.icon.src = await DomUtility.getAnimatedWeatherIcon(data.icon);
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
