import createChart from "./main";

const currentScript = document.currentScript;
const query = new URLSearchParams(
  currentScript.getAttribute("src").replace(/.+\?/, '')
);

const country = query.get("country") || "China";
const element = query.get("element") || "body";

const charts = Array.from(document.querySelectorAll(element)).map(element =>
  createChart(element, { country })
);

export default charts;
