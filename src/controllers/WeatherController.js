import EventBus from "../utilities/EventBus";

export default class WeatherController {
  #weatherDataService;

  constructor(weatherDataService) {
    this.#weatherDataService = weatherDataService;
    this.registerEvents();
  }

  registerEvents() {
    EventBus.on("daySubmitted", (day) =>
      this.updateWeather(this.#weatherDataService.getCurrentLocation(), day),
    );

    EventBus.on("locationUpdated", (location) => this.updateWeather(location));
  }

  async updateWeather(location, dayIndex = 0) {
    if (!location) {
      EventBus.emit("weatherError", { message: "Location not provided." });
      return;
    }
    try {
      EventBus.emit("weatherLoading", { location });
      const { currentForecast, fortnightForecast } =
        await this.#getForecastData();

      const dayForecast = fortnightForecast?.[dayIndex];

      if (!dayForecast) {
        throw new Error(`No forecast found for day index ${dayIndex}`);
      }

      const locationName = await this.#weatherDataService
        .getLocationService()
        .getName(location);

      const { wind, uv, humidity, pressure, suntimes } =
        this.#weatherDataService.extractConditionsData(dayForecast);

      EventBus.emit("weatherUpdated", {
        location: locationName,
        fortnight: fortnightForecast,
        current: currentForecast,
        day: dayForecast,
        dayIndex: dayIndex,
        wind: wind,
        uv: uv,
        humidity: humidity,
        pressure: pressure,
        suntimes: suntimes,
      });
    } catch (error) {
      console.error("Forecast update failed:", error);
      EventBus.emit("weatherError", { message: error.message, error });
    } finally {
      EventBus.emit("weatherLoaded");
    }
  }

  async #getForecastData() {
    const [currentForecast, fortnightForecast] = await Promise.all([
      this.#weatherDataService.getCurrentForecast(),
      this.#weatherDataService.getFortnightData(),
    ]);
    return { currentForecast, fortnightForecast };
  }
}
