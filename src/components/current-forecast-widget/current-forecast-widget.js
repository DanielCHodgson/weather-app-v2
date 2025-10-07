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
      icon: this.#element.querySelector(".icon"), // <div class="icon"></div> in HTML
      temp: this.#element.querySelector(".temp"),
      description: this.#element.querySelector(".description"),
    };
  }

  async setData() {
    try {
      const location = await this.#weatherDataService
        .getLocationService()
        .getTownName();
      const data = await this.#weatherDataService.getCurrentForecast();

      this.#fields.location.textContent = location;
      this.#fields.temp.textContent = `${data.temp}°`;
      this.#fields.description.textContent = data.conditions;
      //this.setWeatherIcon(data.icon);
    } catch (error) {
      console.error("Failed to load data:", error);
      this.#fields.location.textContent = "Unavailable";
      this.#fields.description.textContent = "Data unavailable";
    } finally {
      Object.values(this.#fields).forEach((field) => {
        field.classList.remove("skeleton");
      });
    }
  }

  setWeatherIcon(iconToUse) {
    
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
