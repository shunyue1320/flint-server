module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
    },
    plugins: ["@typescript-eslint", "prettier"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended",
        "prettier",
    ],
    rules: {
        "@typescript-eslint/ban-ts-comment": ["off"],
        "@typescript-eslint/no-explicit-any": ["off"],
        "@typescript-eslint/no-empty-interface": ["off"],
        "@typescript-eslint/no-unsafe-member-access": ["off"],
        "@typescript-eslint/no-unsafe-assignment": ["off"],
        "@typescript-eslint/no-non-null-assertion": ["off"],
    },
    root: true,
};
