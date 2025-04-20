'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import styles from './Variables.module.css';
import { useVariables } from '@/context/VariablesContext';

const {
  variables,
  variables__container,
  variables__table,
  variables__input,
  variables__add,
  button_border,
} = styles;

const Variables = () => {
  const t = useTranslations('variables');
  const {
    variables: storedVariables,
    addVariable,
    updateVariable,
    removeVariable,
  } = useVariables();
  const [newVariableName, setNewVariableName] = useState('');
  const [newVariableValue, setNewVariableValue] = useState('');

  const handleVariableChange = (
    index: number | null,
    updatedVariable: { name: string; value: string }
  ) => {
    if (!updatedVariable.name || !updatedVariable.value) {
      toast.error('Name and value cannot be empty.');
      return;
    }

    const isDuplicate = storedVariables.some(
      (variable, i) =>
        (index === null || i !== index) &&
        variable.name === updatedVariable.name
    );

    if (isDuplicate) {
      toast.error(
        `Variable with name "${updatedVariable.name}" already exists.`
      );
      return;
    }

    if (index === null) {
      addVariable(updatedVariable);
      setNewVariableName('');
      setNewVariableValue('');
    } else {
      updateVariable(index, updatedVariable);
    }
  };

  const handleInputChange = (
    index: number,
    field: 'name' | 'value',
    newValue: string
  ) => {
    const currentVariable = storedVariables[index];
    updateVariable(index, {
      ...currentVariable,
      [field]: newValue,
    });
  };

  const handleAddVariable = () => {
    handleVariableChange(null, {
      name: newVariableName,
      value: newVariableValue,
    });
  };

  return (
    <section className={variables}>
      <h1 className='maintext maintext_green'>{t('var')}</h1>
      <div className={`${variables__container} ${variables__add}`}>
        <table className={variables__table}>
          <thead>
            <tr>
              <th>{t('key')}</th>
              <th>{t('value')}</th>
              <th>{t('action')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>
                <input
                  className={variables__input}
                  type='text'
                  placeholder={t('varName')}
                  value={newVariableName}
                  onChange={(e) => setNewVariableName(e.target.value)}
                />
              </th>
              <th>
                <input
                  className={variables__input}
                  type='text'
                  placeholder={t('varValue')}
                  value={newVariableValue}
                  onChange={(e) => setNewVariableValue(e.target.value)}
                />
              </th>
              <th>
                <button
                  className={`button ${button_border}`}
                  type='button'
                  onClick={handleAddVariable}
                >
                  {t('add')}
                </button>
              </th>
            </tr>
            {storedVariables.map((variable, index) => (
              <tr key={index}>
                <td>
                  <input
                    className={variables__input}
                    type='text'
                    value={variable.name}
                    onChange={(e) =>
                      handleInputChange(index, 'name', e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className={variables__input}
                    type='text'
                    value={variable.value}
                    onChange={(e) =>
                      handleInputChange(index, 'value', e.target.value)
                    }
                  />
                </td>
                <td>
                  <button
                    type='button'
                    className={`button ${button_border}`}
                    onClick={() => removeVariable(variable.name)}
                  >
                    {t('remove')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Variables;
