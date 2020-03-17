# covid-charts

Interactive charts with the number of Coronavirus confirmed cases, deaths, and recovered cases for your country. 

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
 - dom element: chart will be added to this place to DOM 
 - options:
   - width (default: 400)
   - height (default: 300)
   - country (default: 'China')

`createChart` return object with next methods:
 - remove: destroy and remove chart from DOM
 - countries: return a promise with available countries
 - changeCountry: change country to the specified

# acknowledgements

Thanks @pomber for the [data][data-link].

Special thanks to [tradingview][tradingview] for [supa-dupa charts][tradingview-charts].

[example]: https://ucarecdn.com/49c9de71-21de-45a3-97b8-9b48b5fb8fac/
[data-link]: https://github.com/pomber/covid19
[tradingview]: http://tradingview.com/
[tradingview-charts]: https://github.com/tradingview/lightweight-charts
