export default class WeatherAPI {
  #apiKey;

  constructor() {
    this.#apiKey = "G68GFGKVW4WNQHG4WESJWAUKV";
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

      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationQuery}?key=${this.#apiKey}`,
        { mode: "cors" }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const weatherData = await response.json();
      return weatherData;
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      throw error;
    }
  }
}
