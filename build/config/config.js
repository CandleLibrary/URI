import resolve from '@rollup/plugin-node-resolve';

const output = [{
        name: "url",
        file: "./build/url.js",
        format: "esm"
    }];

export default {
    input: "./url.mjs",
    treeshake: false,
    output,
    plugins: [resolve({jail:"",modulesOnly: true})]
};
