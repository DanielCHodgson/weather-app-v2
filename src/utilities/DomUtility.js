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

 static loadAnimatedWeatherIcon(name) {
  const iconSrc = `./src/res/weather-icons/animated/${name}.svg`;

  const img = document.createElement("img");
  img.src = iconSrc;
  img.alt = `${name} icon`;
  img.classList.add("weather-icon");
  return img;
}

}
