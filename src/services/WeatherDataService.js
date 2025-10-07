export default class WeatherDataService {
  #weatherAPI;
  #locationService;

  constructor(weatherAPI, locationService) {
    this.#weatherAPI = weatherAPI;
    this.#locationService = locationService;
  }

  async getAllData() {
    const data = await this.#weatherAPI.getData(
      this.#locationService.getLocation(),
    );
    console.log(data);
  }

  async getFortnightData() {
    const data = await this.#weatherAPI.getData(
      this.#locationService.getLocation(),
    );
    console.log(data.days);
  }

  async getDailyForecast() {
    const data = await this.#weatherAPI.getData(
      this.#locationService.getLocation(),
    );
    console.log(data.currentConditions);
  }
}
