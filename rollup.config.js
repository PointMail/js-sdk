var flow = require("rollup-plugin-flow");

export default {
  input: "src/main.js",
  output: {
    file: "build/index.js",
    format: "umd",
    name: "point-api"
  },
  plugins: [flow()]
};
