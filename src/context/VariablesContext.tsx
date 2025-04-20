'use client';

import { createContext, useContext, useState } from 'react';

export interface Variable {
  name: string;
  value: string;
}

interface VariablesContextProps {
  variables: Variable[];
  addVariable: (variable: Variable) => void;
  updateVariable: (index: number, updatedVariable: Variable) => void;
  removeVariable: (name: string) => void;
}

const VariablesContext = createContext<VariablesContextProps | undefined>(
  undefined
);

export const useVariables = () => {
  const context = useContext(VariablesContext);
  if (!context) {
    throw new Error('useVariables must be used within a VariablesProvider');
  }
  return context;
};

interface VariablesProviderProps {
  children: React.ReactNode;
}

export const VariablesProvider: React.FC<VariablesProviderProps> = ({
  children,
}) => {
  const [variables, setVariables] = useState<Variable[]>([]);

  const addVariable = (variable: Variable) => {
    setVariables([...variables, variable]);
  };

  const updateVariable = (index: number, updatedVariable: Variable) => {
    const updatedVariables = [...variables];
    updatedVariables[index] = updatedVariable;
    setVariables(updatedVariables);
  };

  const removeVariable = (name: string) => {
    setVariables(variables.filter((variable) => variable.name !== name));
  };

  const value = {
    variables,
    addVariable,
    updateVariable,
    removeVariable,
  };

  return (
    <VariablesContext.Provider value={value}>
      {children}
    </VariablesContext.Provider>
  );
};
