import React, { useState, useEffect } from 'react';
import { IconBaseProps } from 'react-icons';

import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';

import { FiMoreHorizontal } from 'react-icons/fi';
import { Container, Item, ButtonMore } from './styles';

interface IOption {
  Icon: JSX.Element;
  title: string;
  onClick: () => void;
  isVisible?: boolean;
}

interface DropdownProps {
  placement: Placement;
  options?: IOption[];
}

export default function Dropdown({
  placement,
  options = [],
}: DropdownProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [referenceElement, setReferenceElement] = useState<any>(null);
  const [popperElement, setPopperElement] = useState<any>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset:
            placement.includes('bottom') || placement.includes('top')
              ? [0, 10]
              : [10, 0],
        },
      },
    ],
  });

  useEffect(() => {
    function handleClickOutside(event: any): void {
      if (popperElement && !popperElement.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popperElement, isOpen]);

  function handleToggleMenu(): void {
    setIsOpen(!isOpen);
  }

  function handleClickOption(): void {
    setIsOpen(false);
  }

  return (
    <>
      <ButtonMore
        type="button"
        ref={setReferenceElement}
        className="cursor-pointer"
        onClick={e => {
          handleToggleMenu();

          e.stopPropagation();
        }}
      >
        <FiMoreHorizontal />
      </ButtonMore>

      <Container
        ref={setPopperElement}
        className={`
        ${isOpen ? 'visible' : 'invisible'}
          `}
        style={styles.popper}
        {...attributes.popper}
      >
        {options?.map(
          ({ Icon, title, onClick, isVisible = true }) =>
            isVisible && (
              <Item
                onClick={() => {
                  if (onClick) {
                    onClick();
                  }
                  setIsOpen(false);
                }}
              >
                {Icon}
                <p>{title}</p>
              </Item>
            ),
        )}
      </Container>
    </>
  );
}
