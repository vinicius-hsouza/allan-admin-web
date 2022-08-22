import { format } from 'date-fns';
import VMasker from 'vanilla-masker';

export function real(value: string): string {
  if (!value) {
    return '';
  }

  return VMasker.toMoney(value, {
    precision: 2,
    separator: ',',
    delimiter: '.',
    unit: 'R$',
  });
}

export function datetime(value: string): string {
  if (!value) {
    return '';
  }

  return format(new Date(value), 'dd/MM/yyyy HH:mm:ss');
}

export function date(value: string): string {
  if (!value) {
    return '';
  }

  return format(new Date(value), 'dd/MM/yyyy');
}
