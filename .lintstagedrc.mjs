const lintStagedObject = {
  '*.{ts,tsx}': ['next lint --fix --file', 'prettier . --write'],
  '*.{json,md,css,scss,yml,yaml}': ['prettier . --write'],
};
export default lintStagedObject;
