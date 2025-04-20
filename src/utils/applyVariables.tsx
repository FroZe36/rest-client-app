import { Variable } from '@/context/VariablesContext';

export interface ApplyVariablesResult {
  replaced: string;
  unmatchedVariables: string[];
}

export const applyVariables = (
  text: string,
  variables: Variable[]
): ApplyVariablesResult => {
  const unmatchedVariables: string[] = [];
  const replaced = text.replace(/{{\s*([\w\d_-]+)\s*}}/g, (_, varName) => {
    const found = variables.find((v) => v.name === varName);
    if (found) {
      return found.value;
    } else {
      unmatchedVariables.push(varName);
      return `{{${varName}}}`;
    }
  });

  return { replaced, unmatchedVariables };
};
