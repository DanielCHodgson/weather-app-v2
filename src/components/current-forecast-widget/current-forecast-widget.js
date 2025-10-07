import htmlString from "./current-forecast-widget.html";
import "./current-forecast-widget.css";
import DomUtility from "../../utilities/DomUtility";

export default class CurrentForecastWidget {
  #weatherDataService;
  #container;
  #element;
  #fields;

  constructor(weatherDataService, container) {
    this.#weatherDataService = weatherDataService;
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.#fields = this.cacheFields();
    this.setData();
    this.render();
  }

  cacheFields() {
    return {
      location: this.#element.querySelector(".location"),
      icon: this.#element.querySelector(".icon"),
      temp: this.#element.querySelector(".temp"),
      description: this.#element.querySelector(".description"),
    };
  }

  async setData() {
    try {
      const [location, data] = await Promise.all([
        this.#weatherDataService.getLocationService().getName(),
        this.#weatherDataService.getCurrentForecast(),
      ]);

      this.#updateLocation(location);
      this.#updateForecast(data);
      await this.#updateIcon(data.icon);
    } catch (error) {
      console.error("Failed to load data:", error);
      this.#showFallback();
    } finally {
      this.#removeSkeleton();
    }
  }

  #updateLocation(location) {
    this.#fields.location.textContent = location;
  }

  #updateForecast(data) {
    this.#fields.temp.textContent = `${data.temp}°`;
    this.#fields.description.textContent = data.conditions;
  }

  async #updateIcon(iconName) {
    this.#fields.icon.src = await DomUtility.getAnimatedWeatherIcon(iconName);
  }

  #showFallback() {
    this.#fields.location.textContent = "Unavailable";
    this.#fields.description.textContent = "Data unavailable";
  }

  #removeSkeleton() {
    Object.values(this.#fields).forEach((field) =>
      field.classList.remove("skeleton"),
    );
  }

  setWeatherIcon(iconToUse) {
    const src = DomUtility.getAnimatedWeatherIcon(iconToUse);
    this.#fields.icon.src = src;
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
