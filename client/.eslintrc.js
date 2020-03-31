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
        "no-console": "off", // Still in development phase, we need useful bug reports
        "lines-between-class-members": "off",
        "object-curly-newline": ["error", {
          "ImportDeclaration": "never",
        }],
        "jsx-a11y/media-has-caption": "off",  // We have specific media players
    },
    parserOptions: {
        project: './tsconfig.json'
    }
  };
