export default class LocationService {
  #location;

  constructor() {
    this.#location = this.initLocation();
  }

  async getUserLocationData() {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });

    const { latitude, longitude } = position.coords;

    return {
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
    };
  }

  async initLocation() {
    try {
      const locationData = await this.getUserLocationData();
      return locationData;
    } catch (error) {
      console.error("Failed to get current location, using default:", error);
      return "London";
    }
  }

  async getLocation() {
    return await this.#location;
  }

  setLocation(newLocation) {
    this.#location = Promise.resolve(newLocation);
  }
}