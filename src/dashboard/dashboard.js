import htmlString from "./dashboard.html";
import "./dashboard.css";
import DomUtility from "../utilities/DomUtility";
import CurrentForecastWidget from "../components/current-forecast-widget/current-forecast-widget";
import HourlyForecastWidget from "../components/hourly-forecast-widget/hourly-forecast-widget";
import ConditionTile from "../components/condition-tile/condition-tile";

export default class Dashboard {
  #container;
  #element;
  #currentWeather;
  #hourlyWeather;
  #windTile;
  #uvTile;
  #humidityTile;
  #pressureTile;
  #sunTimesTile;

  constructor(container) {
    this.#container = container;
    this.#element = DomUtility.stringToHTML(htmlString);
    this.init();
    this.render();
  }

  init() {
    this.#currentWeather = new CurrentForecastWidget(
      this.#element.querySelector(".banner"),
    );
    this.#hourlyWeather = new HourlyForecastWidget(
      this.#element.querySelector(".hourly"),
    );

    this.#windTile = new ConditionTile(
      this.#element.querySelector(".tile-container"),
      "wind",
      (data) => ({
        title: "Wind",
        icon: "../../res/icons/wind.svg",
        value: `${data.speed} km/h`,
        description: `Direction: ${data.direction}°`,
      }),
    );

    this.#uvTile = new ConditionTile(
      this.#element.querySelector(".tile-container"),
      "uv",
      (data) => ({
        title: "UV",
        icon: "../../res/icons/uv.svg",
        value: `Index: ${data.index}`,
        description: data.level,
      }),
    );

    this.#humidityTile = new ConditionTile(
      this.#element.querySelector(".tile-container"),
      "humidity",
      (data) => ({
        title: "Humidity",
        icon: "../../res/icons/humidity.svg",
        value: `${data.humidity}%`,
        description: data.level,
      }),
    );

    this.#pressureTile = new ConditionTile(
      this.#element.querySelector(".tile-container"),
      "pressure",
      (data) => ({
        title: "Pressure",
        icon: "../../res/icons/pressure.svg",
        value: `${data.pressure}mb`,
        description: data.level,
      }),
    );

    this.#sunTimesTile = new ConditionTile(
      this.#element.querySelector(".tile-container"),
      "suntimes",
      (data) => ({
        title: "Sunrise & Sunset",
        icon: "../../res/icons/suntimes.svg",
        value: `${data.sunrise} - ${data.sunset}`,
        description: data.level,
      }),
    );
  }

  render() {
    this.#container.appendChild(this.#element);
  }
}
