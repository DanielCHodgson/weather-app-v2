import htmlString from "./current-forecast-widget.html";
import "./current-forecast-widget.css";
import DomUtility from "../../utilities/DomUtility";

export default class CurrentForecastWidget {

  #container;
  #element;

  constructor(container) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.render();
  }

  setData() {}

  render() {
    this.#container.appendChild(this.#element);
  }
}
