import EventBus from "../utilities/EventBus";

export default class WeatherController {
  #weatherDataService;

  constructor(weatherDataService) {
    this.#weatherDataService = weatherDataService;
    this.registerEvents();
  }

  registerEvents() {
    EventBus.on("locationSubmitted", (location) => this.updateLocation(location));
    EventBus.on("daySubmitted", (day) => this.updateDay(day));
  }

  async updateLocation(location) {
    if (!location) {
      EventBus.emit("locationError", { message: "Invalid location." });
      return;
    }

    try {
      EventBus.emit("locationLoading", { location });

      this.#weatherDataService.getLocationService().setLocation(location);
      const { currentForecast, fortnightForecast } = await this.#getForecastData();

      const dayForecast = fortnightForecast[0];
      const wind = this.#buildWindData(currentForecast);
      const uv = this.#buildUVData(dayForecast);

      EventBus.emit("locationUpdated", {
        location,
        current: currentForecast,
        forecast: fortnightForecast,
        day: dayForecast,
        wind,
        uv,
      });
    } catch (error) {
      console.error("Location update failed:", error);
      EventBus.emit("locationError", { message: error.message, error });
    } finally {
      EventBus.emit("locationLoaded");
    }
  }

  async updateDay(day) {
    try {
      const { currentForecast, fortnightForecast } = await this.#getForecastData();
      const dayForecast = fortnightForecast?.[day];

      if (!dayForecast) {
        throw new Error(`No forecast found for day index ${day}`);
      }

      const wind = this.#buildWindData(dayForecast);
      const uv = this.#buildUVData(dayForecast);

      EventBus.emit("dayUpdated", { current: currentForecast, day: dayForecast, wind, uv });
    } catch (error) {
      console.error("Daily forecast update failed:", error);
      EventBus.emit("dayError", { message: error.message, error });
    } finally {
      EventBus.emit("dayLoaded");
    }
  }

  async #getForecastData() {
    const [currentForecast, fortnightForecast] = await Promise.all([
      this.#weatherDataService.getCurrentForecast(),
      this.#weatherDataService.getFortnightData(),
    ]);
    return { currentForecast, fortnightForecast };
  }

  #buildWindData(forecast) {
    return { speed: forecast.windspeed, direction: forecast.winddir };
  }

  #buildUVData(forecast) {
    return { index: forecast.uvindex };
  }
}
