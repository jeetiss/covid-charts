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

  .covid-19-legend {
    position: absolute;
    top: 2px;
    left: 2px;
    font-size: 12px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .covid-19-legend div {
    background-color: rgba(255, 255, 255, 0.7);
  }

  .covid-19-title {
    font-size: 18px;
    font-weight: 500;
    padding-bottom: 8px;
  }

  .covid-19-confirmed {
    color: red;
  }

  .covid-19-recovered {
    color: #2196f3;
  }
`)
  );
  const head = document.querySelector("head");

  return head.insertBefore(style, head.firstChild);
};

const div = (className, text) => {
  let div = document.createElement("div");
  div.classList.add(className);

  if (text) {
    div.textContent = text;
  }

  return div;
};

const last = arr => arr[arr.length - 1];

const wrapper = (element, text) => {
  element.classList.add("covid-19-chart");

  const confirmed = div("covid-19-confirmed");
  const recovered = div("covid-19-recovered");
  const deaths = div("covid-19-deaths");
  const container = div("covid-19-chart-place");

  const legend = div("covid-19-legend");
  legend.appendChild(div("covid-19-title", text));
  legend.appendChild(confirmed);
  legend.appendChild(recovered);
  legend.appendChild(deaths);

  element.appendChild(legend);
  element.appendChild(container);

  return {
    confirmed,
    recovered,
    deaths,
    container
  };
};

function createChart(
  element,
  { country: initialCountry = "China", width = 400, height = 300 } = {}
) {
  let loadedData;
  let country = initialCountry;

  addStyles();
  const { confirmed, recovered, deaths, container } = wrapper(
    element,
    `COVID-19 in ${country}`
  );

  const chart = tvChart(container, {
    width,
    height,
    localization: {
      priceFormatter: price => Math.round(price).toString()
    },
    grid: {
      horzLines: {
        visible: false
      },
      vertLines: {
        visible: false
      }
    },
    handleScroll: {
      vertTouchDrag: false
    },
    priceScale: {
      scaleMargins: {
        top: 0.15,
        bottom: 0
      }
    }
  });
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

    chart.timeScale().fitContent();
  };

  // let volumeSeries = chart.addHistogramSeries({
  //   color: "rgba(255, 0, 0, 0.2)"
  // });

  loadData().then(data => {
    loadedData = data;
    update(data);

    // volumeSeries.setData(
    //   data[country].map((value, index, data) => ({
    //     time: format(parse(value.date, "yyyy-M-d", new Date()), "yyyy-MM-dd"),
    //     value: index ? value.confirmed - data[index - 1].confirmed : 0
    //   }))
    // );

    setValues(last(data[country]));
  });

  const setValues = data => {
    confirmed.textContent = "confirmed: " + data.confirmed;
    recovered.textContent = "recovered: " + data.recovered;
    deaths.textContent = "deaths: " + data.deaths;
  };

  chart.subscribeCrosshairMove(function(param) {
    if (
      param === undefined ||
      param.time === undefined ||
      param.point.x < 0 ||
      param.point.x > width ||
      param.point.y < 0 ||
      param.point.y > height
    ) {
      loadedData && setValues(last(loadedData[country]));
    } else {
      setValues({
        confirmed: param.seriesPrices.get(lineSeries[0]),
        recovered: param.seriesPrices.get(lineSeries[1]),
        deaths: param.seriesPrices.get(lineSeries[2])
      });
    }
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

export default createChart;
