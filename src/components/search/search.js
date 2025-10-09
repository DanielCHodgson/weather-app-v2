import htmlString from "./search.html";
import "./search.css";
import DomUtility from "../../utilities/DomUtility";

export default class Search {
  #container;
  #element;

  constructor(container) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.render();
  }


  render() {
    this.#container.appendChild(this.#element);
  }
}
