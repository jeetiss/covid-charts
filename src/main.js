import { createChart as tvChart } from "lightweight-charts";
import { parse, format } from "date-fns";

const seriesCreator = data => key =>
  Object.values(data).map(({ date, [key]: value }) => ({
    time: format(parse(date, "yyyy-M-d", new Date()), "yyyy-MM-dd"),
    value
  }));

function createChart(element, { country: initialCountry } = {}) {
  let loadedData
  let country = initialCountry || "China";

  const chart = tvChart(element, { width: 400, height: 300 });
  const lineSeries = [
    chart.addLineSeries({ color: "red" }),
    chart.addLineSeries(),
    chart.addLineSeries({ color: "black" })
  ];

  const update = (data) => {
    const countrySeries = seriesCreator(data[country]);

    lineSeries[0].setData(countrySeries("confirmed"));
    lineSeries[1].setData(countrySeries("recovered"));
    lineSeries[2].setData(countrySeries("deaths"));
  }

  fetch("https://pomber.github.io/covid19/timeseries.json")
    .then(response => response.json())
    .then(data => {
      loadedData = data
      update(data)
    });

  return {
    remove: () => chart.remove(),
    changeCountry: newCountry => {
      country = newCountry;
      update(loadedData);
    },
    countries: () =>
      fetch("https://pomber.github.io/covid19/timeseries.json")
        .then(response => response.json())
        .then(data => Object.keys(data))
  };
}

export default createChart
