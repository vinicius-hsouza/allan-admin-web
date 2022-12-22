import { useState } from 'react'

import { Button } from '@siakit/button'
import { DatePicker } from '@siakit/form-components'

export function Test() {
  const [date, setDate] = useState<Date | null>(new Date())
  console.log(date)
  return (
    <>
      <DatePicker value={date} onChange={setDate} />{' '}
      <Button onClick={() => setDate(new Date(2023, 0, 25))}>teste</Button>
    </>
  )
}
