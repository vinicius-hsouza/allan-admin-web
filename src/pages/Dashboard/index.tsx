import React, { useRef, useEffect } from 'react';
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

import { Container, TypeServicesContainer } from './styles';

export default function Dashboard(): JSX.Element {
  return (
    <Container>
      <TypeServicesContainer>
        <Chart
          options={{
            colors: ['#ff8503'],
            chart: {
              id: 'basic-bar',
            },
            xaxis: {
              categories: [
                1991,
                1992,
                1993,
                1994,
                1995,
                1996,
                1997,
                1998,
                1999,
              ],
            },
          }}
          series={[
            {
              name: 'series-1',
              data: [30, 40, 45, 50, 49, 60, 70, 91],
            },
          ]}
          type="bar"
          width="600"
          height="400"
        />
        <Chart
          options={{
            colors: ['#ff8503'],
            chart: {
              id: 'basic-bar',
            },
            xaxis: {
              categories: [
                1991,
                1992,
                1993,
                1994,
                1995,
                1996,
                1997,
                1998,
                1999,
              ],
            },
          }}
          series={[
            {
              name: 'series-1',
              data: [30, 40, 45, 50, 49, 60, 70, 91],
            },
          ]}
          type="line"
          width="600"
          height="400"
        />
      </TypeServicesContainer>
    </Container>
  );
}
