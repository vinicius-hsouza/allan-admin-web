import React, { useRef, useState } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { usePopper } from 'react-popper';

import ptBR from 'date-fns/locale/pt-BR';

export default function DatePicker(): JSX.Element {
  const referenceElement = useRef(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [visible, setVisible] = useState(false);
  const arrowElement = useRef(null);
  const { styles, attributes } = usePopper(
    referenceElement.current,
    popperElement,
    {
      placement: 'bottom-end',
      // modifiers: [
      //   { name: 'arrow', options: { element: arrowElement.current } },
      // ],
    },
  );

  return (
    <>
      <button
        type="button"
        ref={referenceElement}
        onClick={() => setVisible(!visible)}
      >
        Reference elemente
      </button>

      {visible && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          Popper element
          <div ref={arrowElement} style={styles.arrow}>
            testetetetet
          </div>
        </div>
      )}
    </>
  );
}
