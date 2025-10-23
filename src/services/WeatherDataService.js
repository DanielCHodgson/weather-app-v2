import EventBus from "../utilities/EventBus.js";

export default class WeatherDataService {
  #weatherAPI;
  #locationService;
  #lastFetchedData = null;
  #lastFetchedLocation = null;
  #lastFetchedTime = 0;
  #memoryCacheDuration = 2 * 60 * 1000;
  #isCelsius;
  #lastError = null;

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
        this.refreshData();
      }
    });

    EventBus.on("locationUpdated", () => {
      this.#clearErrorState();
    });
  }

  #clearErrorState() {
    this.#lastError = null;
  }

  #invalidateCache() {
    this.#lastFetchedData = null;
    this.#lastFetchedLocation = null;
    this.#lastFetchedTime = 0;
  }

  async #getOrFetchData() {
    const location = await this.#locationService.getLocation();
    const now = Date.now();

    if (
      this.#lastFetchedData &&
      JSON.stringify(location) === JSON.stringify(this.#lastFetchedLocation) &&
      now - this.#lastFetchedTime < this.#memoryCacheDuration &&
      !this.#lastError
    ) {
      return this.#lastFetchedData;
    }

    try {
      const data = await this.#weatherAPI.getData(location, this.#isCelsius);

      this.#lastFetchedData = data;
      this.#lastFetchedLocation = location;
      this.#lastFetchedTime = now;
      this.#clearErrorState();

      return data;
    } catch (error) {
      this.#lastError = error;
      this.#invalidateCache();
      throw error;
    }
  }

  async getAllData() {
    try {
      return await this.#getOrFetchData();
    } catch (error) {
      console.error("Failed to get all data:", error);
      throw error;
    }
  }

  async getFortnightData() {
    try {
      const data = await this.#getOrFetchData();
      return data.days;
    } catch (error) {
      console.error("Failed to get fortnight data:", error);
      throw error;
    }
  }

  async getCurrentForecast() {
    try {
      const data = await this.#getOrFetchData();
      const locationName = await this.#locationService.getName();
      data.currentConditions.location = locationName;
      return data.currentConditions;
    } catch (error) {
      console.error("Failed to get current forecast:", error);
      throw error;
    }
  }

  extractConditionsData(data) {
    return {
      wind: { speed: data.windspeed, direction: data.winddir },
      uv: { index: data.uvindex },
      humidity: { humidity: data.humidity },
      pressure: { pressure: data.pressure },
      suntimes: { sunrise: data.sunrise, sunset: data.sunset },
    };
  }

  async refreshData() {
    try {
      const location = await this.#locationService.getLocation();
      const data = await this.#weatherAPI.getData(location, this.#isCelsius);

      this.#lastFetchedData = data;
      this.#lastFetchedLocation = location;
      this.#lastFetchedTime = Date.now();
      this.#clearErrorState();

      return data;
    } catch (error) {
      this.#lastError = error;
      this.#invalidateCache();
      console.error("Failed to refresh data:", error);
      throw error;
    }
  }

  getLocationService() {
    return this.#locationService;
  }

  getCurrentLocation() {
    return this.#locationService.getLocation();
  }

  hasError() {
    return this.#lastError !== null;
  }

  getLastError() {
    return this.#lastError;
  }
}
