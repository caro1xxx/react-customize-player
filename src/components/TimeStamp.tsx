import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  margin: 0 10px;
  margin-bottom: 5px;
  color: white;
  font-size: 15px;
`;

type Props = {
  VideoInfo: {
    currentTime: string;
    duration: string;
  };
};
//@ts-ignore
const TimeStamp = (props: Props) => {
  return (
    <Wrap>
      {props.VideoInfo.currentTime}&nbsp;/&nbsp;{props.VideoInfo.duration}
    </Wrap>
  );
};

export default TimeStamp;
