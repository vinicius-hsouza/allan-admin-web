import React from 'react'

import { Flex } from '@siakit/layout'

export default function NewSchedule(): JSX.Element {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 200px)',
        gap: 8,
        gridTemplateRows: 64,
      }}
    >
      <div style={{ backgroundColor: 'tomato', gridColumn: '1 / 4' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '4 / 7' }}>
        <p>teste</p>
      </div>
      {/* <div style={{ backgroundColor: 'blue', display: 'grid', gridTemplateColumns: '64px repeat(2, 1fr)' }}>
        <div style={{ backgroundColor: 'red' }}>
          <p>teste</p>
        </div>
        <div style={{ backgroundColor: 'red' }}>
          <p>teste</p>
        </div>
      </div> */}
      <div style={{ backgroundColor: 'tomato', gridColumn: '1 / 4' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '4 / 6' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '6 / 7' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '1 / 4' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '4 / 7' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '1 / 4' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '4 / 7' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '1 / 4' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '4 / 7' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '1 / 4' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '4 / 7' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '1 / 4' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '4 / 7' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '1 / 4' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '4 / 7' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '1 / 4' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '4 / 7' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '1 / 4' }}>
        <p>teste</p>
      </div>
      <div style={{ backgroundColor: 'tomato', gridColumn: '4 / 7' }}>
        <p>teste</p>
      </div>
    </div>
  )
}
