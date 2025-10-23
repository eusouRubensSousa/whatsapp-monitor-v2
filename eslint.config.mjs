import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  {
    extends: ["next/core-web-vitals"],
    rules: {
      // Adicionar regras customizadas se necessário
    }
  }
]);

export default eslintConfig;