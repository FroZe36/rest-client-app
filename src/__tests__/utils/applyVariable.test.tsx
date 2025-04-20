import { describe, expect, it } from 'vitest';

import { applyVariables } from '@/utils/applyVariables';

import { Variable } from '@/context/VariablesContext';

describe('applyVariables', () => {
  it('should replace existing variables', () => {
    const text = 'Hello, {{name}}! Your age is {{age}}.';
    const variables: Variable[] = [
      { name: 'name', value: 'John' },
      { name: 'age', value: '30' },
    ];
    const result = applyVariables(text, variables);
    expect(result.replaced).toBe('Hello, John! Your age is 30.');
    expect(result.unmatchedVariables).toEqual([]);
  });

  it('should handle unmatched variables', () => {
    const text = 'Hello, {{name}}! Your city is {{city}}.';
    const variables: Variable[] = [{ name: 'name', value: 'John' }];
    const result = applyVariables(text, variables);
    expect(result.replaced).toBe('Hello, John! Your city is {{city}}.');
    expect(result.unmatchedVariables).toEqual(['city']);
  });

  it('should handle empty text', () => {
    const text = '';
    const variables: Variable[] = [{ name: 'name', value: 'John' }];
    const result = applyVariables(text, variables);
    expect(result.replaced).toBe('');
    expect(result.unmatchedVariables).toEqual([]);
  });

  it('should handle empty variables array', () => {
    const text = 'Hello, {{name}}!';
    const variables: Variable[] = [];
    const result = applyVariables(text, variables);
    expect(result.replaced).toBe('Hello, {{name}}!');
    expect(result.unmatchedVariables).toEqual(['name']);
  });

  it('should handle different variable types', () => {
    const text = 'Name: {{name}}, Number: {{number}}, Boolean: {{bool}}';
    const variables: Variable[] = [
      { name: 'name', value: 'John' },
      { name: 'number', value: '123' },
      { name: 'bool', value: 'true' },
    ];
    const result = applyVariables(text, variables);
    expect(result.replaced).toBe('Name: John, Number: 123, Boolean: true');
    expect(result.unmatchedVariables).toEqual([]);
  });

  it('should handle multiple occurrences of the same variable', () => {
    const text = 'Hello, {{name}}! Again, {{name}}!';
    const variables: Variable[] = [{ name: 'name', value: 'John' }];
    const result = applyVariables(text, variables);
    expect(result.replaced).toBe('Hello, John! Again, John!');
    expect(result.unmatchedVariables).toEqual([]);
  });

  it('should handle spaces inside {{ }}', () => {
    const text = 'Hello, {{ name }}! Your age is {{ age }}.';
    const variables: Variable[] = [
      { name: 'name', value: 'John' },
      { name: 'age', value: '30' },
    ];
    const result = applyVariables(text, variables);
    expect(result.replaced).toBe('Hello, John! Your age is 30.');
    expect(result.unmatchedVariables).toEqual([]);
  });

  it('should handle different characters in variable name', () => {
    const text = 'Value of {{var_123}}: {{var_123}}';
    const variables: Variable[] = [{ name: 'var_123', value: 'test' }];
    const result = applyVariables(text, variables);
    expect(result.replaced).toBe('Value of test: test');
    expect(result.unmatchedVariables).toEqual([]);
  });
});
