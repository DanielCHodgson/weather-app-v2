import htmlString from "./forecast-tile.html";
import "./forecast-tile.css";
import DomUtility from "../../../utilities/DomUtility";
import EventBus from "../../../utilities/EventBus";

export default class ForecastTile {
  #container;
  #element;
  #fields = {};
  #dayIndex;

  constructor(container, dayIndex) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.#fields = this.cacheFields();
    this.registerEvents();
    this.render();
    this.#dayIndex = dayIndex;
  }

  registerEvents() {
    this.#element.addEventListener("click", () => {
      EventBus.emit("daySubmitted", this.#dayIndex);

      this.#container
        .querySelectorAll(".forecast-tile")
        .forEach((tile) => tile.classList.remove("selected"));
      this.#toggleSelected(true);
    });
  }

  #toggleSelected(isSelected) {
    if (isSelected) {
      this.#element.classList.add("selected");
    } else {
      this.#element.classList.remove("selected");
    }
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
    this.#fields.actual.textContent = `${data.temp.toFixed(0)}°`;
    this.#fields.feelsLike.textContent = `${data.feelslike.toFixed(0)}°`;
    this.#fields.conditions.textContent = data.conditions;
  }

  async #updateIcon(data) {
    this.#fields.icon.src = await DomUtility.getAnimatedWeatherIcon(data.icon);
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
