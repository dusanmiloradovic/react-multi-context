import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";

export default {
  input: "src/index.js",
  external: ["react", "react-dom"],
  output: {
    file: "distrollup/bundle.js",
    format: "es",
    name: "reactmulticontext",
    sourcemap: true
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      include: "node_modules/**"
    }),
    babel({
      exclude: ["node_modules/**"]
    })
  ]
};
