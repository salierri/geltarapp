module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "no-console": "off", // Still in development phase, we need logging
      "import/extensions": "off",
      "import/no-unresolved": "off", // I couldn't get the resolver to work :((
      "lines-between-class-members": "off",
      "no-param-reassign": "off",
      "object-curly-newline": ["error", {
        "ImportDeclaration": "never",
      }],
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
      "no-underscore-dangle": ["error", { "allow": ["_id"] }]
  },
  parserOptions: {
      project: './tsconfig.json'
  }
};
