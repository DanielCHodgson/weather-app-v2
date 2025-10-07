export default class LocationService {
  #location;

  constructor() {
    this.#location = "London";
  }

  /*
  
  async getCurrentLocationData() {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      const locationData = {
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      };

      return locationData;
    } catch (error) {
      console.error("Failed to get current location:", error);
      throw error;
    }
  }

  */

  getLocation() {
    return this.#location;
  }

  setLocation(newLocation) {
    this.#location = newLocation;
  }
}
