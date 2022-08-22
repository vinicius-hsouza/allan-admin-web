import React, { useEffect, useRef, InputHTMLAttributes, useState } from 'react';
import { useField } from '@unform/core';
import { toPattern } from 'vanilla-masker';
import { FiAlertCircle } from 'react-icons/fi';
import { IconBaseProps } from 'react-icons';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';

import ptBR from 'date-fns/locale/pt-BR';

import { IoCalendar, IoCalendarSharp } from 'react-icons/io5';
import { format, isValid } from 'date-fns';
import {
  Container,
  Error,
  IconButtonCalendar,
  Label,
  PopoverContent,
} from './styles';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  width?: string;
  disabled?: boolean;
  pattern?: string;
  icon?: React.ComponentType<IconBaseProps>;
  onDateSelected?: (date: Date) => void;
}

function DatePicker({
  name,
  label,
  disabled = false,
  onDateSelected,
  ...rest
}: Props): JSX.Element {
  const Popover = PopoverPrimitive.Root;
  const PopoverTrigger = PopoverPrimitive.Trigger;
  // const PopoverContent = PopoverPrimitive.Content;

  const inputRef = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = React.useState<Date | undefined>();

  const { fieldName, defaultValue, registerField, error } = useField(name);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(defaultValue);

  function maskedValue(value: string): void {
    const valueMasked = toPattern(value, '99/99/9999');

    if (inputRef.current) {
      inputRef.current.value = valueMasked;
    }

    setIsFilled(valueMasked);

    const [day, month, year] = valueMasked.split('/');

    const newDate = new Date(Number(year), Number(month) - 1, Number(day));

    if (isValid(newDate) && year.length === 4) {
      setSelected(newDate);
      if (onDateSelected) {
        onDateSelected(newDate);
      }
    }
  }

  function handleSelect(value: Date | undefined): void {
    if (value) {
      setSelected(value);

      const formattedDate = format(value, 'dd/MM/yyyy');

      maskedValue(formattedDate);
    }
  }

  useEffect(() => {
    registerField<Date | undefined>({
      name: fieldName,
      // ref: inputRef,
      getValue: () => selected,
      setValue: (ref, value: Date | undefined) => {
        handleSelect(value);
      },
      clearValue: ref => {
        // eslint-disable-next-line no-param-reassign
        ref.current.value = '';

        setIsFilled('');
        setSelected(undefined);
      },
    });
  }, [fieldName, registerField, selected]);

  return (
    <div>
      {label && <Label>{label}</Label>}

      <Container
        isErrored={!!error}
        isFilled={!!isFilled}
        isFocused={isFocused}
        data-testid="input-container"
      >
        <input
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          id={fieldName}
          ref={inputRef}
          defaultValue={defaultValue}
          onChange={event => {
            maskedValue(event.target.value);
          }}
          disabled={disabled}
          {...rest}
        />

        <Popover>
          <PopoverTrigger asChild>
            <IconButtonCalendar>
              <IoCalendarSharp />
            </IconButtonCalendar>
          </PopoverTrigger>
          <PopoverContent sideOffset={16}>
            <DayPicker
              locale={ptBR}
              mode="single"
              selected={selected}
              month={selected}
              onSelect={handleSelect}
              modifiersStyles={{
                selected: {
                  color: '#ff8503',
                  background: '#343233',
                  border: 'none',
                },
                today: {
                  color: '#237BC3',
                },
              }}
              styles={{
                caption: { color: '#ff8503' },
                day: {
                  color: '#a3b0b4',
                },
              }}
            />
          </PopoverContent>
        </Popover>

        {error && (
          <Error title={error}>
            <FiAlertCircle color="#dc3545" size={16} />
          </Error>
        )}
      </Container>
    </div>
  );
}

export default DatePicker;
