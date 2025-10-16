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
    EventBus.on("locationSubmitted", async (location) => {
      console.log("locations submitted!");
      await this.updateWeather(location);
    });
  }

  async updateWeather(location) {
    try {
      this.#weatherDataService.getLocationService().setLocation(location);

      const current = await this.#weatherDataService.getCurrentForecast();
      const forecast = await this.#weatherDataService.getFortnightData();

      const payload = {
        location:
          current.location ||
          (await this.#weatherDataService.getLocationService().getName()),
        current,
        forecast,
      };

      EventBus.emit("weatherUpdated", payload);
      
    } catch (error) {
      console.error("Failed to update weather:", error);
      this.#uiComponents.errorDisplay.show(error.message);
    }
  }
}
