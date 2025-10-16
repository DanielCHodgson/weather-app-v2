export default class WeatherDataService {
  #weatherAPI;
  #locationService;
  #lastFetchedData = null;
  #lastFetchedLocation = null;
  #lastFetchedTime = 0;
  #memoryCacheDuration = 2 * 60 * 1000;

  constructor(weatherAPI, locationService) {
    this.#weatherAPI = weatherAPI;
    this.#locationService = locationService;
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

    this.#lastFetchedData = data;
    this.#lastFetchedLocation = location;
    this.#lastFetchedTime = now;

    return data;
  }

  async getAllData() {
    return this.#getOrFetchData();
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

  async refreshData() {
    const location = await this.#locationService.getLocation();
    const data = await this.#weatherAPI.getData(location);
    this.#lastFetchedData = data;
    this.#lastFetchedLocation = location;
    this.#lastFetchedTime = Date.now();
    return data;
  }

  getLocationService() {
    return this.#locationService;
  }
}
