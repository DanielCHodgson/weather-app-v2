import EventBus from "../utilities/EventBus";

export default class LocationService {
  #locationPromise = null;
  #defaultLocation = "London, United Kingdom";

  constructor() {
    this.registerEvents();
  }

  registerEvents() {
    EventBus.on("locationSubmitted", (location) => {
      this.setLocation(location);
    });
  }

  async getUserLocationData() {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      return { latitude, longitude, timestamp: new Date().toISOString() };
    } catch (error) {
      if (error.code === error.PERMISSION_DENIED) {
        console.warn("User denied location access.");
      } else {
        console.error("Error fetching geolocation:", error);
      }
      return this.#defaultLocation;
    }
  }

  async initLocation() {
    return this.getUserLocationData();
  }

  async getLocation() {
    if (!this.#locationPromise) {
      this.#locationPromise = this.initLocation();
    }
    return this.#locationPromise;
  }

  async setLocation(location) {
    EventBus.emit("locationLoading", { location });

    try {
      const resolvedLocation = await this.resolveName(location);

      if (!resolvedLocation) {
        throw new Error("Location not found");
      }

      this.#locationPromise = Promise.resolve(resolvedLocation);
      EventBus.emit("locationUpdated", resolvedLocation);
    } catch (error) {
      console.error("Location update failed:", error);
      EventBus.emit("locationError", { message: error.message, error });
    } finally {
      EventBus.emit("locationLoaded");
    }
  }

  async resolveName(location) {
    try {
      let url;

      if (typeof location === "string") {
        const encoded = encodeURIComponent(location);
        url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&q=${encoded}&limit=1`;
      } else if (location.latitude && location.longitude) {
        url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=${location.latitude}&lon=${location.longitude}`;
      } else {
        return this.#defaultLocation;
      }

      const data = await this.#fetchJson(url);
      const result = Array.isArray(data) ? data[0] : data;

      if (!result) return null;

      return this.#extractCityCountry(result);
    } catch (error) {
      console.warn("Failed to resolve location:", error);
      return this.#defaultLocation;
    }
  }

  async getName() {
    const location = await this.getLocation();
    return this.resolveName(location);
  }

  async #fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    return await response.json();
  }

  #extractCityCountry(data) {
    const address = data.address || {};
    const display = data.display_name || "";

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.hamlet ||
      display.split(",")[0]?.trim() ||
      "Unknown";

    const country =
      address.country || display.split(",").pop()?.trim() || "Unknown Country";

    return `${city}, ${country}`;
  }
}
