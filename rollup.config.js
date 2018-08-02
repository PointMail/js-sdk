import typescript from "rollup-plugin-typescript";

export default {
  input: "src/main.js",
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "point-api"
  },
  plugins: [typescript()]
};
