import htmlString from "./hourly-forecast-tile.html";
import "./hourly-forecast-tile.css";
import DomUtility from "../../../utilities/DomUtility";
import EventBus from "../../../utilities/EventBus";

export default class ForecastTile {
  #container;
  #element;
  #fields = {};

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

    EventBus.on("weatherLoaded", () => {
      DomUtility.removeSkeletons(this.#fields);
    });
  }

  cacheFields() {
    return {
      temp: this.#element.querySelector(".temp"),
      icon: this.#element.querySelector(".icon"),
      time: this.#element.querySelector(".time"),
    };
  }

  async setData(data) {
    try {
      this.#fields.temp.textContent = `${data.temp.toFixed(0)}°`;
      this.#fields.time.textContent = this.#trimDatetime(data.datetime);
      await this.#updateIcon(data.icon);
    } catch (error) {
      console.error("Failed to load tile data:", error);
      this.#fields.forEach((element) => {
        DomUtility.showFallbackText(element);
      });
    } finally {
      DomUtility.removeSkeleton(this.#element);
    }
  }

  #trimDatetime(datetime) {
    if (!datetime) return "";

    let timePart = datetime;
    if (datetime.includes("T")) {
      timePart = datetime.split("T")[1];
    }

    const [hours, minutes] = timePart.split(":");

    if (!hours || !minutes) return "";
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  }

  async #updateIcon(icon) {
    this.#fields.icon.src = await DomUtility.getAnimatedWeatherIcon(icon);
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
