import { createGlobalStyle } from 'styled-components';
import 'react-day-picker/dist/style.css';

export const GlobalStyle: any = createGlobalStyle`
:root {
    --color-primary-blue-darkest: #0C3E67;
    --color-primary-blue-dark: #1C6CAD;
    --color-primary-blue: #237BC3;
    --color-primary-blue-light: #3E8DCD;
    --color-primary-blue-lightest: #D0E5F6;

    --color-secondary-dark-blue-darkest: #051D31;
    --color-secondary-dark-blue-dark: #0D3352;
    --color-secondary-dark-blue: #103A5C;
    --color-secondary-dark-blue-light: #2F5473;
    --color-secondary-dark-blue-lightest: #CED8E0;

    --color-green-darkest: #145320;
    --color-green-dark: #278C3A;
    --color-green: #2F9E44;
    --color-green-light: #49AD5C;
    --color-green-lightest: #D3EED8;

    --color-red-darkest: #761212;
    --color-red-dark: #C72828;
    --color-red: #FC1100;
    --color-red-light: #E74A4A;
    --color-red-lightest: #FCD2D2;

    --color-pink-darkest: #670D2C;
    --color-pink-dark: #AC1E50;
    --color-pink: #C2255C;
    --color-pink-light: #CC4071;
    --color-pink-lightest: #F6D0DE;

    --color-purple-darkest: #311B72;
    --color-purple-dark: #5937C0;
    --color-purple: #6741D9;
    --color-purple-light: #7A58E0;
    --color-purple-lightest: #DFD6FA;

    --color-orange-darkest: #7C2A00;
    --color-orange-dark: #CE4D07;
    --color-orange: #E8590C;
    --color-orange-light: #EE6E29;
    --color-orange-lightest: #FFDDCC;

    --color-yellow-darkest: #806500;
    --color-yellow-dark: #DFAB02;
    --color-yellow: #FFC107;
    --color-yellow-light: #FFCB25;
    --color-yellow-lightest: #FFF5CC;

    --color-cyan-darkest: #014651;
    --color-cyan-dark: #087688;
    --color-cyan: #0C8599;
    --color-cyan-light: #2A97A9;
    --color-cyan-lightest: #CCE9ED;

    --color-gray-01: #121214;
    --color-gray-02: #202024;
    --color-gray-03: #29292E;
    --color-gray-04: #323238;
    --color-gray-05: #3B3B42;
    --color-gray-06: #4D4D57;
    --color-gray-07: #737380;
    --color-gray-08: #A8A8B3;
    --color-gray-09: #E1E1E6;
    --color-gray-10: #F5F5F7;

    --color-black: #09090A;

    --shadow-01: 0px 1px 2px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.08);
    --shadow-02: 0px 1px 2px rgba(0, 0, 0, 0.15), 0px 0px 2px rgba(0, 0, 0, 0.1);
    --shadow-03: 0px 4px 8px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.1);

  }

  *{
    margin: 0;
    padding:0;
    box-sizing: border-box;
    outline: 0;

  }

  html, body, #root{
    height: 100%;
    overflow: auto;
  }

  #root{
    display: flex;
  }

  body{
    background: #121214;
    color: #fff;
    -webkit-font-smoothing: antialiased;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }



  body, input, button{
    font-family: 'Inter', sans-serif;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }

  button{
    cursor: pointer;
  }


  ::-webkit-scrollbar {
    margin-bottom: 10px;
    width: 14px;
    height: 14px;
    border-radius: 24px;
  }

  ::-webkit-scrollbar-track {
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 24px;
    box-shadow: inset 0 0 10px 10px rgb(52, 50, 51);
    border: solid 4px transparent;
  }

  .swal2-container {
  z-index: 10000000000;
  }

  .visible{
    visibility: visible;
  }

  .invisible{
    visibility: hidden;
  }

  .rdp-day_selected:not([aria-disabled='true']) {
    background-color: #ff8503;
  }

  .rdp-button:focus,
  .rdp-button:active {
    border-color: #ff8503;
    background-color: #343233;
  }

  .rdp-button:hover:not([aria-disabled='true']) {
    background-color: #ff8503;
    color: #fff;
  }

  .rdp-day_selected:active:not([aria-disabled='true']) {
    color: #fff;
  }

  .rdp-day_selected:focus:not([aria-disabled='true']) {
    color: #fff;
  }

  .rdp-day_selected:hover:not([aria-disabled='true']) {
    color: #fff;
  }


  /* .react-datepicker__input-container{

    > input{
      padding: 8px;
      background: rgba(212, 214, 224, 0.08);
      border: none;
      color: #434344;

      &::placeholder {
      opacity: 0.4;
      }

      height: 36px;
      border-radius: 4px;
    }
  }

  .react-datepicker{
    background: rgba(212, 214, 224, 0.08);
    color: #fff !important;
  } */

  /* .react-datepicker-popper{
    background: red;
  }

  .react-datepicker__month-container{
    background: #7159c1;
  } */
`;
