export default class WeatherAPIService {
  #apiKey;
  #cacheDuration;

  constructor() {
    this.#apiKey = "G68GFGKVW4WNQHG4WESJWAUKV";
    this.#cacheDuration = 30 * 60 * 1000;
  }

  async getData(location) {
    try {
      let locationQuery;

      if (typeof location === "string") {
        locationQuery = location;
      } else if (typeof location === "object" && location.latitude && location.longitude) {
        locationQuery = `${location.latitude},${location.longitude}`;
      } else {
        throw new Error("Invalid location format");
      }

      const cacheKey = `weather_${locationQuery}`;
      const cached = this.#getFromCache(cacheKey);
      if (cached) {
        console.log("Using cached weather data for:", locationQuery);
        return cached;
      }

      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationQuery}?key=${this.#apiKey}`,
        { mode: "cors" }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const weatherData = await response.json();

      this.#saveToCache(cacheKey, weatherData);

      return weatherData;
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      throw error;
    }
  }

  #getFromCache(key) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { timestamp, data } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > this.#cacheDuration;

    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  }

  #saveToCache(key, data) {
    const payload = {
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(key, JSON.stringify(payload));
  }
}
