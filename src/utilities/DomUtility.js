export default class DomUtility {
  static stringToHTML(string) {
    if (typeof string !== "string" || string.trim() === "") {
      throw new Error("loadHTML: Input must be a non-empty HTML string.");
    }

    const temp = document.createElement("div");
    temp.innerHTML = string.trim();
    const element = temp.firstElementChild;

    if (!element) {
      throw new Error(
        "loadHTML: Failed to convert HTML string to a DOM element.",
      );
    }
    return element;
  }

  static renderSvg(svgString) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = svgString;
    return tempDiv.firstChild;
  }

  static async getAnimatedWeatherIcon(name) {
    try {
      const module = await import(`../res/weather-icons/animated/${name}.svg`);
      return module.default;
    } catch (err) {
      console.warn(`Icon "${name}" not found, using default.`);
      const defaultModule = await import(
        `../res/weather-icons/animated/partly-cloudy-day.svg`
      );
      return defaultModule.default;
    }
  }

  async updateIcon(img, iconName) {
    img.src = await this.getAnimatedWeatherIcon(iconName);
  }

  static showFallbackText(field) {
    field.textContent = "No data";
  }

  static removeSkeletons(fields) {
    Object.values(fields).forEach((field) =>
      field.classList.remove("skeleton"),
    );
  }
}
