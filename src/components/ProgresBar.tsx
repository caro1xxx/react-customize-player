import React from 'react';
import styled from 'styled-components';
import withLine from './withLine';
const Wrap = styled.div`
  margin: 0 2%;
  border-radius: 5px;
  background-color: #fb7299;
  position: absolute;
  cursor: pointer;
`;
type Props = {
  long: string;
  high: string;
  color: string;
  zIndex: number;
  top: string;
};

//@ts-ignore
const ProgresBar = (props: Props) => {
  return (
    <Wrap
      style={{
        width: props.long,
        height: props.high,
        background: props.color,
        zIndex: props.zIndex,
        top: props.top,
      }}
    ></Wrap>
  );
};

export default withLine(ProgresBar);
