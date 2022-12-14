import React, { TableHTMLAttributes } from 'react'

import dot from 'dot-object'
import { v4 } from 'uuid'

import { Empty } from '@siakit/empty'

import { Table } from './styles'

interface Option {
  title: string
  dataIndex: string
  render?: (row: any) => {}
}

type ListProps = TableHTMLAttributes<HTMLTableElement> & {
  data: object[]
  options: Option[]
  onClick?: (row: any) => void | undefined
}

const List: React.FC<ListProps> = ({
  data = [],
  options = [],
  onClick = () => undefined,
}) => {
  return (
    <>
      <Table>
        <thead>
          <tr>
            {options.map((option) => (
              <th key={v4()}>{option.title}</th>
            ))}
          </tr>
        </thead>
        {!!data.length && (
          <tbody>
            {data?.map((row) => (
              <tr
                key={v4()}
                onClick={() => {
                  onClick(row)
                }}
              >
                {options.map((option) =>
                  option.render ? (
                    <td key={v4()}>{option.render(row) as any}</td>
                  ) : (
                    <td key={v4()}>
                      {option.dataIndex && dot.pick(option.dataIndex, row)}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        )}
      </Table>
      {/* {!data.length && (
        <div style={{ flex: 1 }}>
          <Empty
            title="sdfsdf"
            description="asdfasdf"
            onClick={() => undefined}
            buttonText="teste"
          />
        </div>
      )} */}
    </>
  )
}

export default List
