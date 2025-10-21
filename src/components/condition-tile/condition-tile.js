import htmlString from "./Condition-tile.html";
import "./condition-tile.css";
import DomUtility from "../../utilities/DomUtility";
import EventBus from "../../utilities/EventBus";

export default class ConditionTile {
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

  cacheFields() {
    return {
      value: this.#element.querySelector(".value"),
      description: this.#element.querySelector(".description"),
      icon: this.#element.querySelector(".icon"),
    };
  }

  registerEvents() {
    EventBus.on("locationUpdated", (data) => {});

    EventBus.on("dayUpdated", (data) => {});
  }

  async setData(data) {
    try {

      // Do stuff with data to update the fields

    } catch (error) {
      console.error("Failed to load data:", error);
      DomUtility.showFallbackText([
        this.#fields.value,
        this.#fields.description,
      ]);
    } finally {
      DomUtility.removeSkeletons(this.#fields);
    }
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
