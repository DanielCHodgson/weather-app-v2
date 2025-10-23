export default class WeatherAPIService {
  #apiKey;
  #cacheService;

  constructor(cacheService) {
    this.#apiKey = "G68GFGKVW4WNQHG4WESJWAUKV";
    this.#cacheService = cacheService;
  }

  async getData(location, useCelsius = true) {
    try {
      const locationQuery = this.#normalizeLocation(location);
      const unitGroup = useCelsius ? "metric" : "us";

      const cacheKey = this.#cacheService.generateKey(locationQuery, unitGroup);
      const cached = await this.#cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }
      const weatherData = await this.#fetchFromAPI(locationQuery, unitGroup);
      
      await this.#cacheService.set(cacheKey, weatherData);

      return weatherData;
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      throw error;
    }
  }

  #normalizeLocation(location) {
    if (typeof location === "string") {
      const trimmed = location.trim();
      if (!trimmed) {
        throw new Error("Please enter a location name.");
      }
      return trimmed;
    } else if (
      typeof location === "object" &&
      location.latitude &&
      location.longitude
    ) {
      return `${location.latitude},${location.longitude}`;
    } else {
      throw new Error("Invalid location format");
    }
  }

  async #fetchFromAPI(locationQuery, unitGroup) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
      locationQuery
    )}?unitGroup=${unitGroup}&key=${this.#apiKey}`;

    const response = await fetch(url, { mode: "cors" });

    if (!response.ok) {
      if (response.status === 400 || response.status === 404) {
        throw new Error(
          `Could not find weather for "${locationQuery}". Please check your spelling or try another location.`
        );
      }
      throw new Error(`Weather API error (status ${response.status})`);
    }

    return await response.json();
  }
}