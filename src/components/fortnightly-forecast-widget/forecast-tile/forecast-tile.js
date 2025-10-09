import htmlString from "./forecast-tile.html";
import "./forecast-tile.css";
import DomUtility from "../../../utilities/DomUtility";

export default class ForecastTile {
  #data;
  #container;
  #element;
  #fields = {};

  constructor(data, container) {
    this.#data = data;
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.#fields = this.cacheFields();
    this.setData(data);
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

  async setData() {
    try {
      this.#updateDay();
      this.#updateForecast();
      await this.#updateIcon();
    } catch (error) {
      console.error("Failed to load data:", error);
      DomUtility.showFallbackText([
        this.#fields.temp,
        this.#fields.feelsLike,
        this.#fields.description,
      ]);
    } finally {
      DomUtility.removeSkeletons(this.#fields);
    }
  }

  #updateDay() {
    const dateStr = this.#data.datetime;
    const date = new Date(dateStr);

    const weekday = date.toLocaleDateString("en-UK", { weekday: "short" });
    const day = date.getDate();

    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const formattedDate = `${weekday} ${getOrdinal(day)}`;
    this.#fields.date.textContent = formattedDate;
  }

  #updateForecast() {
    this.#fields.actual.textContent = `${this.#data.temp}°`;
    this.#fields.feelsLike.textContent = `${this.#data.feelslike}°`;
    this.#fields.conditions.textContent = this.#data.conditions;
  }

  async #updateIcon() {
    this.#fields.icon.src = await DomUtility.getAnimatedWeatherIcon(
      this.#data.icon,
    );
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
