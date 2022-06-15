import reactJsx from "vite-react-jsx";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    environment: "happy-dom",
  },
  plugins: [reactJsx()],
});
