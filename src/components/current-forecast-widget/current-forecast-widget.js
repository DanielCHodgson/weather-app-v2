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
    EventBus.on("weatherLoading", () => {
      DomUtility.addSkeletons(this.#fields);
    });

    EventBus.on("weatherUpdated", (data) => {
      this.setData(data);
    });

    EventBus.on("weatherLoaded", () => {
      DomUtility.removeSkeletons(this.#fields);
    });
  }

  cacheFields() {
    return {
      locationPrimary: this.#element.querySelector(".location .primary"),
      locationSecondary: this.#element.querySelector(".location .secondary"),
      iconWrapper: this.#element.querySelector(".icon-wrapper"),
      icon: this.#element.querySelector(".icon"),
      temp: this.#element.querySelector(".temp"),
      description: this.#element.querySelector(".description"),
    };
  }

  async setData(data) {
    try {
      if (data.dayIndex === 0) {
        this.#updateLocation(data.location);
        this.#updateForecast(data.current);
        await this.#updateIcon(data.current.icon);
        await this.#updateBanner(data.current.icon);
      } else {
        this.#updateLocation(data.location);
        this.#updateForecast(data.day);
        await this.#updateIcon(data.day.icon);
        await this.#updateBanner(data.day.icon);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      DomUtility.showFallbackText([
        this.#fields.locationPrimary,
        this.#fields.locationSecondary,
        this.#fields.description,
      ]);
    }
  }

  #updateLocation(location) {
    let city = "";
    let country = "";

    if (typeof location === "string") {
      [city, country] = location.split(",").map((s) => s.trim());
    } else if (typeof location === "object" && location !== null) {
      city = location.city;
      country = location.country;
    }

    this.#fields.locationPrimary.textContent = city || "—";
    this.#fields.locationSecondary.textContent = country || "—";
  }

  setWeatherIcon(iconToUse) {
    const src = DomUtility.getAnimatedWeatherIcon(iconToUse);
    this.#fields.icon.src = src;
  }

  #updateForecast(data) {
    this.#fields.temp.textContent = `${data.temp.toFixed(0)}°`;
    this.#fields.description.textContent = data.conditions;
  }

  async #updateIcon(iconName) {
    try {
      this.#fields.icon.src = await DomUtility.getAnimatedWeatherIcon(iconName);
    } catch (err) {
      console.error("Failed to load icon:", err);
      this.#fields.icon.src = "../../res/icons/blank.svg";
    }
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

  render() {
    this.#container.appendChild(this.#element);
  }
}
