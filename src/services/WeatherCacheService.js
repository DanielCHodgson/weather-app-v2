export default class WeatherCacheService {
  #indexedDBService;
  #cacheDuration;

  constructor(indexedDBService, cacheDuration = 30 * 60 * 1000) {
    this.#indexedDBService = indexedDBService;
    this.#cacheDuration = cacheDuration;
  }

  async get(key) {
    try {
      const cached = await this.#indexedDBService.get(key);
      if (!cached) return null;

      const { timestamp, data } = cached;
      const isExpired = Date.now() - timestamp > this.#cacheDuration;

      if (isExpired) {
        await this.#indexedDBService.delete(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  async set(key, data) {
    try {
      const payload = {
        timestamp: Date.now(),
        data,
      };
      await this.#indexedDBService.set(key, payload);
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  async delete(key) {
    try {
      await this.#indexedDBService.delete(key);
    } catch (error) {
      console.error("Cache delete error:", error);
    }
  }

  async clear() {
    try {
      await this.#indexedDBService.clear();
    } catch (error) {
      console.error("Cache clear error:", error);
    }
  }

  generateKey(location, unitGroup) {
    const locationStr = typeof location === "string" 
      ? location 
      : `${location.latitude},${location.longitude}`;
    return `weather_${locationStr}_${unitGroup}`;
  }
}