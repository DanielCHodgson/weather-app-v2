import EventBus from "../utilities/EventBus";

export default class WeatherController {
  #weatherDataService;
  #dayIndex = 0;

  constructor(weatherDataService) {
    this.#weatherDataService = weatherDataService;
    this.registerEvents();
  }

  registerEvents() {
    EventBus.on("locationSubmitted", async (location) => {
      await this.updateLocation(location);
    });

     EventBus.on("dayUpdated", async (index) => {
      await this.updateDailyForecast(index);
    });
  }

  async updateLocation(location) {
    try {
      EventBus.emit("locationLoading", { location });

      this.#weatherDataService.getLocationService().setLocation(location);

      const current = await this.#weatherDataService.getCurrentForecast();
      const forecast = await this.#weatherDataService.getFortnightData();

      EventBus.emit("locationUpdated", { location, current, forecast });
    } catch (error) {
      console.error("Location update failed:", error);
      EventBus.emit("locationError", { message: error.message });
    } finally {
      EventBus.emit("locationLoaded");
    }
  }

  async updateDailyForecast(index) {
    try {
      EventBus.emit("dailyForecastLoading", { location });

      const forecast = await this.#weatherDataService.getFortnightData();

      EventBus.emit("dailyForecastUpdated", forecast[index]);
    } catch (error) {
      console.error("Daily forecast update failed:", error);
      EventBus.emit("dailyForecastError", { message: error.message });
    } finally {
      EventBus.emit("dailyForecastLoaded");
    }
  }

  getDay() {
    return this.#dayIndex;
  }

  setDay(index) {
    return this.#dayIndex;
  }
}
