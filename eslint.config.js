const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      // Aviso: arquivo com mais de 150 linhas
      "max-lines": ["warn", {
        max: 150,
        skipBlankLines: false,
        skipComments: false
      }],
      
      // Aviso: comentários no código
      "no-inline-comments": ["warn"],
      "line-comment-position": ["warn", { "position": "above" }],
      "no-warning-comments": ["warn", {
        "terms": ["todo", "fixme", "xxx", "note", "hack", "bug", "//", "/*"],
        "location": "anywhere"
      }],
      "spaced-comment": ["warn", "always", {
        "line": { "markers": ["!"], "exceptions": ["-", "+", "*", "/"] },
        "block": { "markers": ["!"], "exceptions": ["*"], "balanced": true }
      }],

      // Regras TypeScript recomendadas
      ...tsPlugin.configs.recommended.rules
    }
  }
];
