// @ts-check

/**
 * Commit 사전 검증 환경설정
 * @see https://github.com/lint-staged/lint-staged#configuration
 */
const lintStagedConfig = {
  "./**/*.{css,scss}": "stylelint --config ./stylelint.config.mjs",
  "./**/*.{js,jsx,mjs,cjs}":
    "eslint --quiet --cache --config ./eslint.config.mjs .",
  "./**/*.{ts,tsx,mts,cts}": () => [
    "node ./node_modules/typescript/lib/tsc.js --build --noEmit --pretty",
    "eslint --quiet --cache --config ./eslint.config.mjs .",
  ],
  // @see https://github.com/microsoft/parallel-prettier/tree/master
  "./**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,json,md,css,scss": "prettier --write",
};

module.exports = lintStagedConfig;
