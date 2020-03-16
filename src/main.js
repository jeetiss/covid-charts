import { createChart as tvChart } from "lightweight-charts";
import { parse, format } from "date-fns";

const seriesCreator = data => key =>
  Object.values(data).map(({ date, [key]: value }) => ({
    time: format(parse(date, "yyyy-M-d", new Date()), "yyyy-MM-dd"),
    value
  }));

let dataPromise;
const loadData = () => {
  if (!dataPromise) {
    dataPromise = fetch(
      "https://pomber.github.io/covid19/timeseries.json"
    ).then(response => response.json());
  }

  return dataPromise;
};

let styles;
const addStyles = () => {
  if (styles) return;
  styles = true;
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.appendChild(
    document.createTextNode(`
  .covid-19-chart {
    position: relative;
  }

  .covid-19-title {
    position: absolute;
    top: 8px;
    left: 8px;
    font-size: 24px;
    font-weight: 600;
    z-index: 10;
  }
`)
  );
  const head = document.querySelector("head");

  return head.insertBefore(style, head.firstChild);
};

const wrapper = (element, text) => {
  let div = document.createElement("div");
  div.classList.add("covid-19-title");
  div.textContent = text;

  element.classList.add("covid-19-chart");
  element.appendChild(div);

  return element;
};

function createChart(
  element,
  { country: initialCountry = "China", width = 400, height = 300 } = {}
) {
  let loadedData;
  let country = initialCountry;

  addStyles();
  wrapper(element, country);

  const chart = tvChart(element, { width, height });
  const lineSeries = [
    chart.addLineSeries({ color: "red" }),
    chart.addLineSeries(),
    chart.addLineSeries({ color: "black" })
  ];

  const update = data => {
    const countrySeries = seriesCreator(data[country]);

    lineSeries[0].setData(countrySeries("confirmed"));
    lineSeries[1].setData(countrySeries("recovered"));
    lineSeries[2].setData(countrySeries("deaths"));
  };

  loadData().then(data => {
    loadedData = data;
    update(data);
  });

  return {
    remove: () => chart.remove(),
    changeCountry: newCountry => {
      country = newCountry;
      update(loadedData);
    },
    countries: () => loadData().then(data => Object.keys(data))
  };
}

window.createChart = createChart;

export default createChart;
