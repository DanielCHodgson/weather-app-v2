import EventBus from "../utilities/EventBus";

export default class WeatherController {
  #weatherDataService;

  constructor(weatherDataService) {
    this.#weatherDataService = weatherDataService;
    this.registerEvents();
  }

  registerEvents() {
    EventBus.on("locationSubmitted", async (location) => {
      await this.updateLocation(location);
    });

    EventBus.on("daySubmitted", async (day) => {
      await this.updateDay(day);
    });
  }

  async updateLocation(location) {
    try {
      EventBus.emit("locationLoading", { location });

      this.#weatherDataService.getLocationService().setLocation(location);

      const currentForecast =
        await this.#weatherDataService.getCurrentForecast();
      const fortnightForecast =
        await this.#weatherDataService.getFortnightData();
      const dayForecast = fortnightForecast[0];

      EventBus.emit("locationUpdated", {
        location,
        current: currentForecast,
        forecast: fortnightForecast,
        day: dayForecast,
      });
    } catch (error) {
      console.error("Location update failed:", error);
      EventBus.emit("locationError", { message: error.message });
    } finally {
      EventBus.emit("locationLoaded");
    }
  }

  async updateDay(day) {
    try {
      const currentForecast =
        await this.#weatherDataService.getCurrentForecast();
      const fortnightForecast =
        await this.#weatherDataService.getFortnightData();
      const dayForecast = fortnightForecast[day];

      EventBus.emit("dayUpdated", {
        current: currentForecast,
        day: dayForecast,
      });
    } catch (error) {
      console.error("Daily forecast update failed:", error);
      EventBus.emit("dailyForecastError", { message: error.message });
    } finally {
      EventBus.emit("dailyForecastLoaded");
    }
  }

  /*
  async updateHourlyForecast(day) {
    try {
      EventBus.emit("hourlyForecastLoading", { location });
      const forecast = day.hours;
      EventBus.emit("hourlyForecastUpdated", forecast);
    } catch (error) {
      console.error("Hourly forecast update failed:", error);
      EventBus.emit("hourlyForecastError", { message: error.message });
    } finally {
      EventBus.emit("hourlyForecastLoaded");
    }
  }

  */
}
