import htmlString from "./search.html";
import "./search.css";
import DomUtility from "../../utilities/DomUtility";
import EventBus from "../../utilities/EventBus";

export default class Search {
  #container;
  #element;
  #form;
  #input;

  constructor(container) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.#form = this.#element.querySelector(".search-pill");
    this.#input = this.#element.querySelector(".search-input");
    this.render();
    this.addEventListener();
  }

  addEventListener() {
    this.#form.addEventListener("submit", (event) => {
      event.preventDefault();
      EventBus.emit("locationSubmitted", this.#input.value);
    });
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
