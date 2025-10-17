export default class LocationService {
  #locationPromise = null;
  #defaultLocation = "London, United Kingdom";

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

  async getName() {
    const location = await this.getLocation();

    if (typeof location === "string") {
      return this.#resolveName({ query: location });
    }

    if (location.latitude && location.longitude) {
      return this.#resolveName({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }

    return "Unknown";
  }

  async #resolveName({ query, latitude, longitude }) {
    try {
      let url;

      if (query) {
        const encoded = encodeURIComponent(query);
        url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&q=${encoded}&limit=1`;
      } else if (latitude && longitude) {
        url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=${latitude}&lon=${longitude}`;
      } else {
        throw new Error("Invalid location parameters");
      }

      const data = await this.#fetchJson(url);
      const result = Array.isArray(data) ? data[0] : data;

      if (!result) {
        throw new Error(
          `No matching location found for "${query ?? "coordinates"}"`,
        );
      }

      return this.#extractCityCountry(result);
    } catch (error) {
      throw new Error(error.message || "Failed to resolve location");
    }
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

  async getLocation() {
    if (!this.#locationPromise) {
      this.#locationPromise = this.initLocation();
    }
    return this.#locationPromise;
  }

  setLocation(newLocation) {
    this.#locationPromise = Promise.resolve(newLocation);
  }
}
