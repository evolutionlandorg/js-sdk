import { defineConfig } from "rollup";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

export default defineConfig({
  input: ["src/index.ts"],
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
      globals: {
        "lodash-es": "lodashEs",
      },
    },
  ],
  plugins: [
    typescript(),
    resolve({
      moduleDirectories: ["node_modules"],
    }),
    commonjs(),
  ],
  external: ["lodash-es"],
});
