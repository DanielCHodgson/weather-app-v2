import EventBus from "../utilities/EventBus";

export default class WeatherController {
  #weatherDataService;

  constructor(weatherDataService) {
    this.#weatherDataService = weatherDataService;
    this.registerEvents();
  }

  registerEvents() {
    EventBus.on("locationSubmitted", async (location) => {
      await this.updateWeather(location);
    });
  }

  async updateWeather(location) {
    try {
      EventBus.emit("weatherLoading", { location });

      this.#weatherDataService.getLocationService().setLocation(location);

      const current = await this.#weatherDataService.getCurrentForecast();
      const forecast = await this.#weatherDataService.getFortnightData();

      EventBus.emit("weatherUpdated", { location, current, forecast });
    } catch (error) {
      console.error("Weather update failed:", error);
      EventBus.emit("weatherError", { message: error.message });
    } finally {
      EventBus.emit("weatherLoaded");
    }
  }
}
