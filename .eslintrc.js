module.exports = {
    env: {
        browser: false,
        es2021: true,
        mocha: true,
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "prettier", // keep last
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {},
}
