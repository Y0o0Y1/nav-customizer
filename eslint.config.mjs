import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import a11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
                project: "./tsconfig.json"
            },
            globals: {
                ...globals.browser
            }
        },
        plugins: {
            react,
            "react-hooks": reactHooks,
            "jsx-a11y": a11y,
            import: importPlugin,
            "@typescript-eslint": tseslint
        },
        settings: {
            "import/resolver": {
                node: {
                    extensions: [".js", ".jsx", ".ts", ".tsx"]
                }
            }
        },
        rules: {
            ...js.configs.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "jsx-a11y/anchor-is-valid": "warn",
            "import/no-unresolved": ["error", { commonjs: true, amd: true, ignore: ['^@'] }],
            "import/no-extraneous-dependencies": "error",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "max-len": ["warn", { "code": 150, "tabWidth": 2 }]
        }
    }
];
