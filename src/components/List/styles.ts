import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px !important;

  > thead {
    > tr {
      border-radius: 8px;

      th {
        padding: 16px 8px;
        background: #272727;

        text-align: left;
        font-weight: bold;
        color: #aeaeae;

        white-space: nowrap;
        position: sticky;
        top: 0;

        &:first-child {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }

        &:last-child {
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }

  > tbody {
    > tr {
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }

      > td {
        padding: 8px;
        text-align: left;
        background: #202023;

        white-space: nowrap;
        position: sticky;
        top: 0;

        &:first-child {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }

        &:last-child {
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }
`;
