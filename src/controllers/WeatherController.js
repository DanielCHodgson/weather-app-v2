import EventBus from "../utilities/EventBus";

export default class WeatherController {
  #weatherDataService;

  constructor(weatherDataService) {
    this.#weatherDataService = weatherDataService;
    this.registerEvents();
  }

  registerEvents() {
    EventBus.on("locationSubmitted", (location) =>
      this.updateLocation(location),
    );
    EventBus.on("daySubmitted", (day) =>
      this.updateWeather(this.#weatherDataService.getCurrentLocation(), day),
    );
  }

  async updateLocation(location) {
    if (!location) {
      EventBus.emit("locationError", { message: "Invalid location." });
      return;
    }

    try {
      EventBus.emit("locationLoading", { location });

      this.#weatherDataService.getLocationService().setLocation(location);
      this.updateWeather(location, 0);

      EventBus.emit("locationUpdated", location);
    } catch (error) {
      console.error("Location update failed:", error);
      EventBus.emit("locationError", { message: error.message, error });
    } finally {
      EventBus.emit("locationLoaded");
    }
  }

  async updateWeather(location, dayIndex = 0) {
    if (!location) {
      EventBus.emit("dayError", { message: "Location not provided." });
      return;
    }
    try {
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
        this.#extractConditionsData(dayForecast);

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

  #extractConditionsData(forecast) {
    return {
      wind: { speed: forecast.windspeed, direction: forecast.winddir },
      uv: { index: forecast.uvindex },
      humidity: { humidity: forecast.humidity },
      pressure: { pressure: forecast.pressure },
      suntimes: { sunrise: forecast.sunrise, sunset: forecast.sunset },
    };
  }
}
