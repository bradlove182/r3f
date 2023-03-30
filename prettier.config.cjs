/** @type {import("prettier").Config} */
const config = {
    tabWidth: 4,
    plugins: [require.resolve("prettier-plugin-tailwindcss")],
};

module.exports = config;
