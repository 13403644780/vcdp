import typescript2 from "rollup-plugin-typescript2"
import dts from "rollup-plugin-dts"
import image from "@rollup/plugin-image"
import terser from "@rollup/plugin-terser"
import { nodeResolve, } from "@rollup/plugin-node-resolve"
import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
const isProduction = process.env.NODE_ENV === "production"

const config = [
    {
        input: "src/index.ts",
        output: [
            {
                file: "lib/vcdp.cjs.js",
                format: "cjs",
                sourcemap: true,
            },
            {
                file: "lib/vcdp.cjs.min.js",
                format: "cjs",
                plugins: [terser(),],
            },
            {
                file: "lib/vcdp.umd.js",
                format: "umd",
                name: "vcdp",
            },
            {
                file: "lib/vcdp.umd.min.js",
                format: "umd",
                name: "vcdp",
                plugins: [
                    terser(),
                ],
            },
            {
                file: "lib/vcdp.esm.js",
                format: "esm",
                sourcemap: true,
            },
            {
                file: "lib/vcdp.esm.min.js",
                format: "esm",
                plugins: [terser(),],
            },
        ],
        plugins: [
            typescript2({
                tsconfig: "./tsconfig.json",
                useTsconfigDeclarationDir: true,
                tsconfigOverride: {
                    compilerOptions: {
                        target: isProduction ? "es5" : "es2015",
                    },
                },
            }),
            image(),
            nodeResolve(),
            babel({
                babelHelpers: "bundled",
                exclude: "node_modules/**",
            }),
            commonjs({
                include: "node_modules/**",
            }),
        ],
    },
    {
        input: "src/index.ts",
        output: {
            file: "lib/index.d.ts",
            format: "es",
        },
        plugins: [dts(),],
    },
]

export default config
