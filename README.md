# covid-charts

Interactive chart with the number of Coronavirus confirmed cases, deaths, and recovered cases for you country. 

![example][example]

> Data from [pomber/covid19][data-link]

## install

#### with npm

```
npm i covid-charts
```

```js
import createChart from "covid-charts";

const chart = createChart(document.body, {
  country: "France",
  width: 400,
  height: 300
});
```

#### with CDN via unpkg

```html
<script src="https://unpkg.com/covid-charts/index.js"></script>
<script>
  const chart = createChart(document.body, {
    country: "France",
    width: 400,
    height: 300
  });
</script>
```

## api

`createChart` params:
 - dom element: in that place of DOM chart will be added
 - options:
   - width: width of chart (default: 400)
   - height: height of chart (default: 300)
   - country: data for this coutry will showed (default: 'China')

`createChart` return object with next methods:
 - remove: desproy and remove chart from DOM
 - countries: return a promise with available countries
 - changeCountry: change showed country to specified

[example]: https://ucarecdn.com/49c9de71-21de-45a3-97b8-9b48b5fb8fac/
[data-link]: https://github.com/pomber/covid19
