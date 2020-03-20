import createChart from "../src/main";
import { batch } from "./batch";

const createSyncedVar = search => {
  const ss = new URLSearchParams(search);
  const obj = Array.from(ss.entries()).reduce((obj, [key, value]) => {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }

    return obj;
  }, {});

  const updateUrl = batch(() => {
    let newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      ss.toString();
    window.history.pushState({}, "", newurl);
  });

  return new Proxy(obj, {
    deleteProperty: (target, name) => {
      delete target[name];
      ss.delete(name);

      updateUrl();

      return true;
    },
    set: (target, name, value) => {
      console.log("set");
      target[name] = value;

      if (Array.isArray(value)) {
        ss.delete(name);
        value.forEach(val => ss.append(name, val));
      } else {
        ss.set(name, value);
      }

      updateUrl();

      return true;
    }
  });
};

const search = createSyncedVar(document.location.search);

if (!search.c) {
  search.c = ["China", "Taiwan*", "France", "Korea, South"];
}

if (!Array.isArray(search.c)) {
  search.c = [search.c];
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

search.c.reduce((element, country) => {
  const div = document.createElement("div");
  createChart(div, { country });

  insertAfter(div, element);

  return div;
}, document.querySelector("body h1"));

// const load = countries =>
//   fetch("https://covid19-graphql.now.sh/", {
//     method: "POST",
//     body: JSON.stringify({
//       query: `{
//             countries(names: ${JSON.stringify(countries)}) {
//               name results {
//                 time:date(format: "yyyy-MM-dd") confirmed deaths recovered
//               }
//             }
//           }`
//     })
//   }).then(result => result.json());