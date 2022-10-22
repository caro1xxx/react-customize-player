import React from 'react';

type Props = {
  long: string;
  high: string;
  color: string;
  zIndex: number;
  top: string;
};

const withLine = (WapperComponent: (props: Props) => JSX.Element) => {
  const Line = (props: Props) => {
    return <div>{<WapperComponent {...props}></WapperComponent>}</div>;
  };
  return Line;
};

export default withLine;
