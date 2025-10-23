export default class IndexedDBService {
  #dbName = "WeatherAppDB";
  #storeName = "weatherCache";
  #version = 1;
  #db = null;

  async #openDB() {
    if (this.#db) return this.#db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.#dbName, this.#version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.#db = request.result;
        resolve(this.#db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.#storeName)) {
          db.createObjectStore(this.#storeName, { keyPath: "key" });
        }
      };
    });
  }

  async set(key, value) {
    try {
      const db = await this.#openDB();
      const transaction = db.transaction([this.#storeName], "readwrite");
      const store = transaction.objectStore(this.#storeName);
      
      await new Promise((resolve, reject) => {
        const request = store.put({ key, value });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("IndexedDB set error:", error);
      throw error;
    }
  }

  async get(key) {
    try {
      const db = await this.#openDB();
      const transaction = db.transaction([this.#storeName], "readonly");
      const store = transaction.objectStore(this.#storeName);

      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result?.value || null);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("IndexedDB get error:", error);
      return null;
    }
  }

  async delete(key) {
    try {
      const db = await this.#openDB();
      const transaction = db.transaction([this.#storeName], "readwrite");
      const store = transaction.objectStore(this.#storeName);

      await new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("IndexedDB delete error:", error);
      throw error;
    }
  }

  async clear() {
    try {
      const db = await this.#openDB();
      const transaction = db.transaction([this.#storeName], "readwrite");
      const store = transaction.objectStore(this.#storeName);

      await new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("IndexedDB clear error:", error);
      throw error;
    }
  }
}