import htmlString from "./daily-forecast-tile.html";
import "./daily-forecast-tile.css";
import DomUtility from "../../../utilities/DomUtility";
import EventBus from "../../../utilities/EventBus";

export default class DailyForecastTile {
  #container;
  #element;
  #fields = {};
  #dayIndex;

  constructor(container, dayIndex) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.#fields = this.cacheFields();
    this.#dayIndex = dayIndex;

    this.registerEvents();
    this.render();
  }

  registerEvents() {
    this.#element.addEventListener("click", () => {
      EventBus.emit("daySubmitted", this.#dayIndex);
    });

    EventBus.on("locationLoading", () => DomUtility.addSkeletons(this.#fields));

    EventBus.on("weatherLoaded", () =>
      DomUtility.removeSkeletons(this.#fields),
    );

    EventBus.on("locationError", () =>
      DomUtility.removeSkeletons(this.#fields),
    );
  }

  select() {
    this.#element.classList.add("selected");
  }

  deselect() {
    this.#element.classList.remove("selected");
  }

  cacheFields() {
    return {
      date: this.#element.querySelector(".date"),
      actual: this.#element.querySelector(".actual"),
      feelsLike: this.#element.querySelector(".feels-like"),
      iconWrapper: this.#element.querySelector(".icon-wrapper"),
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
      Object.values(this.#fields).forEach((el) =>
        DomUtility.showFallbackText(el),
      );
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
