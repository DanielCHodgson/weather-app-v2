import EventBus from "../utilities/EventBus";

export default class LocationService {
  #location;

  constructor() {
    this.#location = this.initLocation();
    this.registerEvents();
  }

  registerEvents() {
    EventBus.on("locationSubmitted", (data) => this.handleLocationUpdate(data));
  }

  handleLocationUpdate(data) {
    this.setLocation(data);
    console.log("Updated location:", data);
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

  async getName() {
    try {
      const location = await this.#location;

      if (!location.latitude || !location.longitude) {
        return location.town || "Unknown";
      }

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.latitude}&lon=${location.longitude}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch town name");
      }

      const data = await response.json();

      const town =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.hamlet ||
        "Unknown";

      return town;
    } catch (error) {
      console.error("Error fetching town name:", error);
      return "Unknown";
    }
  }

  async getLocation() {
    return await this.#location;
  }

  setLocation(newLocation) {
    this.#location = Promise.resolve(newLocation);
  }
}
