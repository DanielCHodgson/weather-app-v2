import htmlString from "./condition-tile.html";
import "./condition-tile.css";
import DomUtility from "../../utilities/DomUtility";
import EventBus from "../../utilities/EventBus";

export default class ConditionTile {
  #container;
  #element;
  #fields;
  #type;
  #formatter;

  constructor(container, type, formatter = null) {
    this.#container = container;
    this.#type = type;
    this.#formatter = formatter;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.#fields = this.cacheFields();
    this.registerEvents();
    this.render();
  }

  cacheFields() {
    return {
      title: this.#element.querySelector(".title"),
      value: this.#element.querySelector(".value"),
      description: this.#element.querySelector(".description"),
      iconWrapper: this.#element.querySelector(".icon-wrapper"),
      icon: this.#element.querySelector(".icon"),
    };
  }

  registerEvents() {
    EventBus.on("weatherLoading", () => {
      DomUtility.addSkeletons(this.#fields);
    });
    EventBus.on("weatherUpdated", (data) => this.handleUpdate(data));

    EventBus.on("weatherLoaded", () => {
      DomUtility.removeSkeletons(this.#fields);
    });
  }

  handleUpdate(data) {
    const conditionData = data[this.#type];
    if (conditionData) {
      this.setData(conditionData);
    } else {
      console.warn(`No data found for condition type "${this.#type}"`);
    }
  }

  async setData(data) {
    try {
      let displayData = data;
      if (typeof this.#formatter === "function") {
        displayData = this.#formatter(data);
      }

      if (displayData.title) {
        this.#fields.title.textContent = displayData.title;
      }
      if (displayData.icon) {
        this.#fields.icon.src = this.#updateIcon(this.#type, false);
      }
      if (displayData.value) {
        this.#fields.value.textContent = displayData.value;
      }
      if (displayData.description) {
        this.#fields.description.textContent = displayData.description;
      }
    } catch (error) {
      console.error(`Failed to load data for type "${this.#type}":`, error);
      DomUtility.showFallbackText([
        this.#fields.title,
        this.#fields.value,
        this.#fields.description,
      ]);
    } finally {
      DomUtility.removeSkeletons(this.#fields);
    }
  }

  async #updateIcon(icon) {
    this.#fields.icon.src = await DomUtility.getIcon(icon);
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
