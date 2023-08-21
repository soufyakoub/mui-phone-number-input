import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

const external = [
  ...Object.keys(pkg.peerDependencies),
  ...Object.keys(pkg.dependencies),
].map((m) => new RegExp(`^${m}`));

export default [
  {
    input: "src/index.tsx",
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true, exports: "named" },
      { file: pkg.module, format: "esm", sourcemap: true, exports: "named" },
    ],
    plugins: [resolve(), commonjs(), typescript(), terser()],
    external,
  },
];
