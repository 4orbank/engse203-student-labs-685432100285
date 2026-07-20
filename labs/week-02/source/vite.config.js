import { defineConfig } from "vite";

const repositoryName = "engse203-student-labs-685432100285";

export default defineConfig({
  base: `/${repositoryName}/labs/week-02/`,
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});
