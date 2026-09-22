import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

const notificationRules = {
  rules: {
    "require-options-object": {
      meta: {
        type: "problem",
        fixable: "code",
        messages: {
          expectedOptions:
            "notify.{{method}} must receive an options object such as { title: message }.",
        },
      },
      create(context) {
        return {
          CallExpression(node) {
            const { callee } = node;

            if (
              callee.type !== "MemberExpression" ||
              callee.computed ||
              callee.object.type !== "Identifier" ||
              callee.object.name !== "notify" ||
              callee.property.type !== "Identifier" ||
              !["success", "error"].includes(callee.property.name)
            ) {
              return;
            }

            const options = node.arguments[0];
            const hasTitle = options?.type === "ObjectExpression" &&
              options.properties.some(
                (property) =>
                  property.type === "Property" &&
                  !property.computed &&
                  ((property.key.type === "Identifier" &&
                    property.key.name === "title") ||
                    (property.key.type === "Literal" &&
                      property.key.value === "title")),
              );

            if (!hasTitle) {
              context.report({
                node,
                messageId: "expectedOptions",
                data: { method: callee.property.name },
                fix:
                  options && options.type !== "ObjectExpression"
                    ? (fixer) => [
                        fixer.insertTextBefore(options, "{ title: "),
                        fixer.insertTextAfter(options, " }"),
                      ]
                    : null,
              });
            }
          },
        };
      },
    },
  },
};

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      notification: notificationRules,
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "notification/require-options-object": "error",
    },
  },
  {
    files: ["vite.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
