module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'react-app',
      'airbnb-typescript',
    ],
    rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "react/destructuring-assignment": "off",
        "max-len": "off", // We have big enough monitors in 2020
        "no-console": "off", // Still in development phase, at least we can get useful bug reports
    },
    parserOptions: {
        project: './tsconfig.json'
    }
  };
