import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

const external = ["date-fns", "lightweight-charts"];
export default [
  {
    input: "src/main.js",
    output: {
      format: "cjs",
      file: "cjs/index.js",
      sourcemap: false
    },
    external
  },
  {
    input: "src/main.js",
    output: {
      format: "esm",
      file: "esm/index.js",
      sourcemap: false
    },
    external
  },
  {
    input: "src/main.js",
    output: {
      format: "umd",
      file: "index.js",
      name: "createChart",
      sourcemap: false
    },
    plugins: [commonjs(), resolve(), terser()]
  }
];
