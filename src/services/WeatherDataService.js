import EventBus from "../utilities/EventBus.js";

export default class WeatherDataService {
  #weatherAPI;
  #locationService;
  #lastFetchedData = null;
  #lastFetchedLocation = null;
  #lastFetchedTime = 0;
  #memoryCacheDuration = 2 * 60 * 1000;
  #isCelsius;

  constructor(weatherAPI, locationService) {
    this.#weatherAPI = weatherAPI;
    this.#locationService = locationService;

    const saved = localStorage.getItem("isCelsius");
    this.#isCelsius = saved !== null ? JSON.parse(saved) : true;

    this.#registerEvents();
  }

  #registerEvents() {
    EventBus.on("unitChanged", (useCelsius) => {
      if (typeof useCelsius === "boolean") {
        this.#isCelsius = useCelsius;
        localStorage.setItem("isCelsius", JSON.stringify(useCelsius));
        EventBus.emit("unitUpdated", this.#isCelsius ? "C" : "F");
      }
    });
  }

  async #getOrFetchData() {
    const location = await this.#locationService.getLocation();
    const now = Date.now();

    if (
      this.#lastFetchedData &&
      JSON.stringify(location) === JSON.stringify(this.#lastFetchedLocation) &&
      now - this.#lastFetchedTime < this.#memoryCacheDuration
    ) {
      return this.#lastFetchedData;
    }

    const data = await this.#weatherAPI.getData(location);

    const convertedData = this.#convertDataTemperatures(data);
    this.#lastFetchedData = convertedData;
    this.#lastFetchedLocation = location;
    this.#lastFetchedTime = now;

    return convertedData;
  }

  #convertDataTemperatures(data) {
    const cloned = JSON.parse(JSON.stringify(data));

    if (
      cloned.currentConditions &&
      typeof cloned.currentConditions.temp === "number"
    ) {
      cloned.currentConditions.temp = this.#convertTemperature(
        cloned.currentConditions.temp,
      );
    }

    if (cloned.days && Array.isArray(cloned.days)) {
      cloned.days = cloned.days.map((day) => ({
        ...day,
        temp: this.#convertTemperature(day.temp),
        tempmax: this.#convertTemperature(day.tempmax),
        tempmin: this.#convertTemperature(day.tempmin),
        feelslike: this.#convertTemperature(day.feelslike),
        feelslikemax: this.#convertTemperature(day.feelslikemax),
        feelslikemin: this.#convertTemperature(day.feelslikemin), 
      }));
    }

    return cloned;
  }

  async getAllData() {
    return await this.#getOrFetchData();
  }

  async getFortnightData() {
    const data = await this.#getOrFetchData();
    return data.days;
  }

  async getCurrentForecast() {
    const data = await this.#getOrFetchData();
    const locationName = await this.#locationService.getName();
    data.currentConditions.location = locationName;
    return data.currentConditions;
  }

  #convertTemperature(value) {
    if (typeof value !== "number") return value;
    if (this.#isCelsius) {
      const celsius = ((value - 32) * 5) / 9;
      return Math.round(celsius);
    }
    return Math.round(value);
  }

  async refreshData() {
    const location = await this.#locationService.getLocation();
    const data = await this.#weatherAPI.getData(location);
    const convertedData = this.#convertDataTemperatures(data);
    this.#lastFetchedData = convertedData;
    this.#lastFetchedLocation = location;
    this.#lastFetchedTime = Date.now();
    return convertedData;
  }

  getLocationService() {
    return this.#locationService;
  }
}
