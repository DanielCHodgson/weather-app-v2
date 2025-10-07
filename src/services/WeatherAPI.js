export default class WeatherAPI {
  #apiKey;

  constructor() {
    this.#apiKey = "G68GFGKVW4WNQHG4WESJWAUKV";
  }

  async getData(location) {
    try {
      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${this.#apiKey}`,
        { mode: "cors" },
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
