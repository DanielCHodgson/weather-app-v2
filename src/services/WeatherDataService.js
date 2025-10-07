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
    console.log(data);
  }

  async getFortnightData() {
    const location = await this.#locationService.getLocation();
    const data = await this.#weatherAPI.getData(location);
    console.log(data.days);
  }

  async getDailyForecast() {
    const location = await this.#locationService.getLocation();
    const data = await this.#weatherAPI.getData(location);
    console.log(data.currentConditions);
  }
}