module.exports = {
  root: true,
  env: { browser: true, es2020: true, es6: true, node: true },
  extends: [
    "prettier",
    "plugin:prettier/recommended",
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:@react-three/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: [
      "./tsconfig.json",
      "./tsconfig.node.json",
      "./tsconfig.worker.json",
    ],
    "ecmaFeatures": {
      "jsx": true
    },
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    rules: {
      "curly": ["warn", "multi-line", "consistent"],
      "no-console": "off",
      "no-empty-pattern": "warn",
      "no-duplicate-imports": "error",
      "import/no-unresolved": "off",
      "import/export": "error",
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#eslint-plugin-import
      // We recommend you do not use the following import/* rules, as TypeScript provides the same checks as part of standard type checking:
      "import/named": "off",
      "import/namespace": "off",
      "import/default": "off",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "jest/consistent-test-it": ["error", { "fn": "it", "withinDescribe": "it" }]
    }
  },
  plugins: ["react-refresh", "@typescript-eslint", "react", "react-hooks", "import", "jest", "prettier", "@react-three"],
  rules: {
    // ignore misused promises since we use async functions in react click handlers
    "@typescript-eslint/no-misused-promises": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "curly": ["warn", "multi-line", "consistent"],
    "no-console": "off",
    "no-empty-pattern": "warn",
    "no-duplicate-imports": "error",
    "import/no-unresolved": "off",
    "import/export": "error",
    "no-unused-vars": [
      "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ],
    "react-refresh/only-export-components": [
      "warn",
        { allowConstantExport: true },
      ]
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".js", ".jsx", ".ts", ".tsx"]
    },
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx", ".json"],
        "paths": ["src"]
      },
      "alias": {
        "extensions": [".js", ".jsx", ".ts", ".tsx", ".json"],
        "map": [["@react-three/fiber", "./packages/fiber/src/web"]]
      }
    }
  },
  "overrides": [
    {
      "files": ["src"],
      "parserOptions": {
        "project": "./tsconfig.json"
      }
    }
  ],
};
