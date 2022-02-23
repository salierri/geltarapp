module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'react-app',
      'airbnb-typescript',
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "react/destructuring-assignment": "off",
        "no-console": "off", // Still in development phase, we need useful bug reports
        "lines-between-class-members": "off",
        "implicit-arrow-linebreak": "off", // Conflicting with max-len
        "object-curly-newline": ["error", {
          "ImportDeclaration": "never",
        }],
        "no-underscore-dangle": ["error", { allow: ['_id'] }],  // Mongodb uses _id, and it cannot be changed
        "no-param-reassign": "off",
        "max-len": ["error",
          110,  // Up from 100
          2,
          {
            "ignoreUrls": true,
            "ignoreComments": false,
            "ignoreRegExpLiterals": true,
            "ignoreStrings": true,
            "ignoreTemplateLiterals": true
          }
        ],
        "jsx-a11y/media-has-caption": "off",  // We have special media players
        "no-multi-spaces": ["error", { "ignoreEOLComments": true } ],
      },
    parserOptions: {
        project: './tsconfig.json'
    }
  };
