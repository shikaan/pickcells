import { defineConfig } from "vite";
import postcssNesting from 'postcss-nesting';
import childProcess from 'child_process';

const GIT_SHA = childProcess.execSync('git rev-parse HEAD').toString().trim().slice(0, 7);

console.log('GIT_SHA', GIT_SHA);

export default defineConfig({
    css: {
        postcss: {
            plugins: [
                postcssNesting
            ],
        },
    },
    define: {
        'VERSION': JSON.stringify(GIT_SHA),
    },
});
