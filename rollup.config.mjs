import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const banner = `/**
 * @gks101@numtowords - Number to Words Multilingual Library
 * @version 1.0.0
 * @license MIT
 */`;

/** @type {import('rollup').RollupOptions[]} */
export default [
  // ── ESM bundle ──────────────────────────────────────────────────────────────
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.esm.js",
      format: "esm",
      banner,
      sourcemap: true,
    },
    plugins: [
      resolve(),
      typescript({ tsconfig: "./tsconfig.json", declarationDir: "dist/types" }),
    ],
  },

  // ── CJS bundle ──────────────────────────────────────────────────────────────
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.cjs.js",
      format: "cjs",
      banner,
      exports: "named",
      sourcemap: true,
    },
    plugins: [
      resolve(),
      typescript({ tsconfig: "./tsconfig.json", declaration: false }),
    ],
  },

  // ── UMD (browser) bundle ────────────────────────────────────────────────────
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.umd.js",
      format: "umd",
      name: "NumToWords",
      banner,
      sourcemap: true,
    },
    plugins: [
      resolve(),
      typescript({ tsconfig: "./tsconfig.json", declaration: false }),
    ],
  },

  // ── Type declarations bundle ─────────────────────────────────────────────────
  {
    input: "dist/types/index.d.ts",
    output: { file: "dist/index.d.ts", format: "esm" },
    plugins: [dts()],
  },
];
