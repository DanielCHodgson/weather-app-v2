import EventBus from "../utilities/EventBus";

export default class WeatherController {
  #weatherDataService;
  #uiComponents;

  constructor(weatherDataService, uiComponents) {
    this.#weatherDataService = weatherDataService;
    this.#uiComponents = uiComponents;

    this.#registerEvents();
  }

  #registerEvents() {
    EventBus.on("locaitonSubmitted", async (location) => {
      await this.updateWeather(location);
    });
  }

  async updateWeather(location) {
    try {
      this.#weatherDataService.getLocationService().setLocation(location);

      const current = await this.#weatherDataService.getCurrentForecast();
      const forecast = await this.#weatherDataService.getFortnightData();

      this.#uiComponents.current.setData(current);
      this.#uiComponents.forecast.setData(forecast);
    } catch (error) {
      console.error("Failed to update weather:", error);
      this.#uiComponents.errorDisplay.show(error.message);
    }
  }
}
