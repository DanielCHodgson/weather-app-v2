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

      const windForecast = {
        speed: currentForecast.windspeed,
        direction: currentForecast.winddir,
      };

      const uvForecast = {
        index: dayForecast.uvindex,
      };

      EventBus.emit("locationUpdated", {
        location,
        current: currentForecast,
        forecast: fortnightForecast,
        day: dayForecast,
        wind: windForecast,
        uv: uvForecast,
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

      const windForecast = {
        speed: dayForecast.windspeed,
        direction: dayForecast.winddir,
      };

      const uvForecast = {
        index: dayForecast.uvindex,
      };

      EventBus.emit("dayUpdated", {
        current: currentForecast,
        day: dayForecast,
        wind: windForecast,
        uv: uvForecast,
      });
    } catch (error) {
      console.error("Daily forecast update failed:", error);
      EventBus.emit("dailyForecastError", { message: error.message });
    } finally {
      EventBus.emit("dailyForecastLoaded");
    }
  }
}
