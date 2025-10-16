import htmlString from "./current-forecast-widget.html";
import "./current-forecast-widget.css";
import DomUtility from "../../utilities/DomUtility";

export default class CurrentForecastWidget {
  #container;
  #element;
  #fields;

  constructor(container) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.#fields = this.cacheFields();
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

  async setData(data) {
    try {
       console.log(data)
      this.#updateLocation(data);
      this.#updateForecast(data);
      await this.#updateIcon(data.icon);
    } catch (error) {
      console.error("Failed to load data:", error);
      DomUtility.showFallbackText([
        this.#fields.location,
        this.#fields.description,
      ]);
    } finally {
      DomUtility.removeSkeletons(this.#fields);
    }
  }

  #updateLocation(data) {
   
    this.#fields.location.textContent = data.location;
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
