/// <reference types="@emotion/react/types/css-prop" /> 
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}