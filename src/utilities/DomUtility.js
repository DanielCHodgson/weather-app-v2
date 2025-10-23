import blankIcon from "../res/icons/blank.svg";

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

  static async getIcon(name) {
    try {
      const module = await import(`../res/icons/${name}.svg`);
      return module.default;
    } catch (err) {
      console.warn(`Icon "${name}" not found, using default.`);
      const defaultModule = await import(`../res/icons/blank.svg`);
      return defaultModule.default;
    }
  }

  static async getWeatherBanner(name) {
    try {
      const module = await import(`../res/weather-icons/banners/${name}.jpg`);
      return module.default;
    } catch (err) {
      console.warn(`Icon "${name}" not found, using default.`);
      const defaultModule = await import(
        `../res/weather-icons/banners/partly-cloudy-day.jpg`
      );
      return defaultModule.default;
    }
  }

  static showFallbackText(field) {
    field.textContent = "No data";
  }

  static addSkeleton(element) {
    element.classList.add("skeleton");
    if (element.tagName === "IMG") {
      element.src = blankIcon;
    } else {
      element.textContent = "";
    }
  }

  static removeSkeleton(element) {
    element.classList.remove("skeleton");
  }

  static addSkeletons(elements) {
    Object.values(elements).forEach((element) => this.addSkeleton(element));
  }

  static removeSkeletons(elements) {
    Object.values(elements).forEach((element) => this.removeSkeleton(element));
  }
}
