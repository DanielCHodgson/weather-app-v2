import htmlString from "./current-forecast-widget.html";
import "./current-forecast-widget.css";
import DomUtility from "../../utilities/DomUtility";
import EventBus from "../../utilities/EventBus";

export default class CurrentForecastWidget {
  #container;
  #element;
  #fields;

  constructor(container) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.#fields = this.cacheFields();
    this.registerEvents();
    this.render();
  }

  registerEvents() {
    EventBus.on("locationUpdated", (data) => {
      this.setData(data.current);
    });

    EventBus.on("dayUpdated", (data) => {
      const forecast = data.day;
      forecast.location = this.#getCurrentLocation();
      this.setData(forecast);
    });
  }

  cacheFields() {
    return {
      locationPrimary: this.#element.querySelector(".location .primary"),
      locationSecondary: this.#element.querySelector(".location .secondary"),
      icon: this.#element.querySelector(".icon"),
      temp: this.#element.querySelector(".temp"),
      description: this.#element.querySelector(".description"),
    };
  }

  async setData(data) {
    try {
      this.#updateLocation(data);
      this.#updateForecast(data);
      await this.#updateIcon(data.icon);
      await this.#updateBanner(data.icon);
    } catch (error) {
      console.error("Failed to load data:", error);
      DomUtility.showFallbackText([
        this.#fields.locationPrimary,
        this.#fields.locationSecondary,
        this.#fields.description,
      ]);
    } finally {
      DomUtility.removeSkeletons(this.#fields);
    }
  }

  #updateLocation(data) {
    if (!data.location) {
      this.#fields.locationPrimary.textContent = "";
      this.#fields.locationSecondary.textContent = "";
      return;
    }

    if (typeof data.location === "string") {
      const [city, country] = data.location.split(",").map((s) => s.trim());
      this.#fields.locationPrimary.textContent = city || "";
      this.#fields.locationSecondary.textContent = country || "";
    } else if (typeof data.location === "object") {
      this.#fields.locationPrimary.textContent = data.location.city || "";
      this.#fields.locationSecondary.textContent = data.location.country || "";
    }
  }

  #updateForecast(data) {
    this.#fields.temp.textContent = `${data.temp.toFixed(0)}°`;
    this.#fields.description.textContent = data.conditions;
  }

  async #updateIcon(iconName) {
    this.#fields.icon.src = await DomUtility.getAnimatedWeatherIcon(iconName);
  }

  async #updateBanner(iconName) {
    try {
      const bannerUrl = await DomUtility.getWeatherBanner(iconName);
      this.#element.style.backgroundImage = `url(${bannerUrl})`;
      this.#element.style.backgroundSize = "cover";
      this.#element.style.backgroundPosition = "bottom center";
      this.#element.style.repeat = "no repeat";
    } catch (err) {
      console.error("Failed to update banner:", err);
    }
  }

  setWeatherIcon(iconToUse) {
    const src = DomUtility.getAnimatedWeatherIcon(iconToUse);
    this.#fields.icon.src = src;
  }

  #getCurrentLocation() {
    return `${this.#fields.locationPrimary.textContent}, ${this.#fields.locationSecondary.textContent}`;
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
