import React, {
  useEffect,
  useRef,
  InputHTMLAttributes,
  useCallback,
  useState,
} from 'react';
import { useField } from '@unform/core';
import { toMoney, toPattern } from 'vanilla-masker';
import { FiAlertCircle } from 'react-icons/fi';
import { IconBaseProps } from 'react-icons';

import masks from '../../utils/masks';

import { Container, Error, Label } from './styles';

type Mask = keyof typeof masks;

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  mask?: Mask | 'money';
  label?: string;
  width?: string;
  disabled?: boolean;
  pattern?: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const InputMask: React.FC<Props> = ({
  name,
  mask,
  label,
  width = 'initial',
  disabled = false,
  pattern,
  icon: Icon,
  onChange,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { fieldName, defaultValue, registerField, error } = useField(name);

  function maskedValue(value: string): string {
    if (value) {
      if (mask === 'money') {
        return toMoney(value, { unit: 'R$' });
      }

      if (mask === 'hour') {
        return toPattern(value, '99:99');
      }

      if (mask === 'phone') {
        if (value.length >= 11) {
          return toPattern(value, '(99) 99999-9999');
        }
        if (value.length <= 10) {
          return toPattern(value, '(99) 9999-9999');
        }
      }

      if (mask === 'percent') {
        if (value.length === 1) {
          return toPattern(value, '9');
        }
        if (value.length === 2) {
          return toPattern(value, '99');
        }
        if (value.length === 3) {
          return toPattern(value, '999');
        }
      }

      if (mask) {
        return toPattern(value, masks[mask]);
      }

      return toPattern(value, pattern);
    }

    return '';
  }

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(maskedValue(defaultValue || ''));

  const masked = useCallback(
    (data: any) => {
      const value = maskedValue(data);

      if (inputRef.current) {
        inputRef.current.value = value;
      }
    },
    [mask],
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      path: 'value',
      ref: inputRef.current,
      setValue: (ref, value) => {
        setIsFilled(String(value));
        masked(value);
      },
      clearValue: ref => {
        const reference = ref;
        reference.value = '';
        setIsFilled('');
      },
    });
  }, [fieldName, registerField, masked]);

  return (
    <div>
      {label && <Label>{label}</Label>}

      <Container
        isErrored={!!error}
        isFilled={!!isFilled}
        isFocused={isFocused}
        data-testid="input-container"
      >
        {Icon && <Icon size={20} />}
        <input
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          id={fieldName}
          ref={inputRef}
          defaultValue={maskedValue(defaultValue || '')}
          onChange={e => {
            masked(e.target.value);
            setIsFilled(e.target.value);
            if (onChange) {
              onChange(e);
            }
          }}
          disabled={disabled}
          {...rest}
        />

        {error && (
          <Error title={error}>
            <FiAlertCircle color="#dc3545" size={16} />
          </Error>
        )}
      </Container>
    </div>
  );
};

export default InputMask;
