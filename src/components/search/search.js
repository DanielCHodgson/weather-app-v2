import htmlString from "./search.html";
import "./search.css";
import DomUtility from "../../utilities/DomUtility";
import EventBus from "../../utilities/EventBus";

export default class Search {
  #container;
  #signal;
  #element;
  #form;
  #input;
  #message;

  constructor(container, signal) {
    this.#container = container;
    this.#signal = signal;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.#message = this.#element.querySelector(".search-message");
    this.#form = this.#element.querySelector(".search-pill");
    this.#input = this.#element.querySelector(".search-input");
    this.render();
    this.addEventListeners();
    this.registerEventHandlers();
  }

  addEventListeners() {
    this.#input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.clearMessage();
        this.#handleSubmit(event);
      }
    });

    this.#element
      .querySelector(".clear-btn")
      .addEventListener("click", (event) => {
        this.#handleClearClick(event);
      });
  }

  registerEventHandlers() {
    EventBus.on("weatherError", (error) => {
      this.showMessage(error.message, "error");
    });

    EventBus.on("weatherUpdated", () => {
      this.clearMessage();
    });
  }

  showMessage(text, type) {
    this.#message.textContent = text;
    this.#message.className = `search-message ${type}`;
  }

  clearMessage() {
    this.#message.textContent = "";
  }

  #handleSubmit(event) {
    event.preventDefault();
    const value = this.#input.value.trim();
    if (!value) {
      this.showMessage("Please enter a location name.", "error");
      return;
    }
    EventBus.emit(this.#signal, value);
  }

  #handleClearClick(event) {
    event.preventDefault();
    this.#input.value = "";
    this.clearMessage();
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
