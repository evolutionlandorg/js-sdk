import { defineConfig } from "rollup";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import nodePolyfills from "rollup-plugin-polyfill-node";

export default defineConfig({
  input: ["dist/index.js"],
  output: [
    {
      file: "lib/index.js",
      format: "es",
    },
    {
      file: "lib/index.min.js",
      format: "umd",
      name: "Evolution",
      plugins: [terser()],
      exports: "auto",
    },
  ],
  plugins: [typescript(), commonjs(), json(), nodePolyfills(), resolve()],
});
