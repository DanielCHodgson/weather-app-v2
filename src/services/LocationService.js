export default class LocationService {
  #location;

  constructor() {
    this.#location = this.initLocation();
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
      console.log("Resolving name for location:", location);

      if (typeof location === "string") {
        const query = encodeURIComponent(location);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${query}&limit=1`,
        );

        if (!response.ok) {
          throw new Error("Failed to resolve location name from text input");
        }

        const results = await response.json();
        if (results.length === 0) {
          throw new Error(`No matching location found for "${location}"`);
        }

        const match = results[0];
        const displayName =
          match.display_name ||
          match.name ||
          match.address?.city ||
          match.address?.town ||
          "Unknown";

        return displayName;
      }

      if (location.latitude && location.longitude) {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.latitude}&lon=${location.longitude}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch town name from coordinates");
        }

        const data = await response.json();

        const town =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.hamlet ||
          data.display_name ||
          "Unknown";

        return town;
      }

      if (location.town) return location.town;

      return "Unknown";
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
