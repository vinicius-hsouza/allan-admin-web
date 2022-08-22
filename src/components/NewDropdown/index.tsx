import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { FiMoreHorizontal } from 'react-icons/fi';
import { MdMoreHoriz } from 'react-icons/md';
import { ButtonMore, DropdownContent, Option, types } from './styles';

export type Types = keyof typeof types;

interface IOption {
  Icon: JSX.Element;
  title: string;
  onClick: () => void;
  isVisible?: boolean;
  type?: Types;
}

interface DropdownProps {
  options?: IOption[];
}

export default function NewDropdown({
  options = [],
}: DropdownProps): JSX.Element {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <ButtonMore type="button">
          <MdMoreHoriz />
        </ButtonMore>
      </DropdownMenu.Trigger>

      <DropdownContent sideOffset={4} align="end">
        {options.map(
          option =>
            option.isVisible && (
              <DropdownMenu.Item>
                <Option
                  type={option.type || 'default'}
                  onClick={() => {
                    if (option.onClick) {
                      option.onClick();
                    }
                  }}
                >
                  {option.Icon}
                  <p>{option.title}</p>
                </Option>
              </DropdownMenu.Item>
            ),
        )}
      </DropdownContent>
    </DropdownMenu.Root>
  );
}
