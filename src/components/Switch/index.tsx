import React, { useEffect, InputHTMLAttributes, useState } from 'react';
import { useField } from '@unform/core';
import { FiAlertCircle } from 'react-icons/fi';

import { Container, Content, Error } from './styles';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const Switch: React.FC<Props> = ({
  name,
  label,
  disabled = false,
  onChange,
  orientation = 'horizontal',
  ...rest
}) => {
  const { fieldName, defaultValue, registerField, error } = useField(name);

  const [value, setValue] = useState(() => defaultValue || false);

  // useEffect(() => {
  //   if (onChange && defaultValue) {
  //     onChange({
  //       target: {
  //         checked: defaultValue,
  //       },
  //     });
  //   }
  // }, [onChange, defaultValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      clearValue: () => setValue(false),
      setValue: (ref, data) => {
        if (onChange) {
          onChange(data);
        }
        setValue(data);
      },
    });
  }, [fieldName, registerField, value]);

  return (
    <Container isErrored={!!error} orientation={orientation}>
      <label htmlFor={fieldName}>
        <Content htmlFor={fieldName} disabled={disabled}>
          <input
            defaultChecked={defaultValue}
            checked={value}
            onChange={e => {
              setValue(e.target.checked);

              if (onChange) {
                onChange(e);
              }
            }}
            id={fieldName}
            type="checkbox"
            disabled={disabled}
            {...rest}
          />

          <span />
        </Content>

        {label}
      </label>

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#dc3545" size={16} />
        </Error>
      )}
    </Container>
  );
};

export default Switch;
