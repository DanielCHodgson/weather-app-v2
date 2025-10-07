export default class WeatherDataService {
  #weatherAPI;
  #locationService;

  constructor(weatherAPI, locationService) {
    this.#weatherAPI = weatherAPI;
    this.#locationService = locationService;
  }

  async getAllData() {
    const location = await this.#locationService.getLocation();
    const data = await this.#weatherAPI.getData(location);
    return data;
  }

  async getFortnightData() {
    const location = await this.#locationService.getLocation();
    const data = await this.#weatherAPI.getData(location);
    return data.days;
  }
  

  async getCurrentForecast() {
    const location = await this.#locationService.getLocation();
    const data = await this.#weatherAPI.getData(location);
    return data.currentConditions;
  }

  getLocationService() {
    return this.#locationService;
  }

}