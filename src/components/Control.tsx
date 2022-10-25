import React from 'react';
import styled from 'styled-components';
import TimeStamp from './TimeStamp';
const Wrap = styled.div`
  background-image: linear-gradient(#c3c3c316, #343434b0);
  position: absolute;
  bottom: 0px;
  height: 40px;
  left: 0;
  right: 0;
  z-index: 2;
  padding: 0 20px;
  display: flex;
  align-items: center;
`;

type Props = {
  isPlayFlag: boolean;
  play: () => void;
  VideoInfo: {
    currentTime: string;
    duration: string;
  };
};

// @ts-ignore
const Control = (props: Props) => {
  return (
    <Wrap>
      <div onClick={props.play}>
        {props.isPlayFlag ? (
          <svg
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6744"
            width="25"
            height="25"
          >
            <path
              d="M870.2 466.333333l-618.666667-373.28a53.333333 53.333333 0 0 0-80.866666 45.666667v746.56a53.206667 53.206667 0 0 0 80.886666 45.666667l618.666667-373.28a53.333333 53.333333 0 0 0 0-91.333334z"
              fill="#ffffff"
              p-id="6745"
            ></path>
          </svg>
        ) : (
          <svg
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1401"
            width="25"
            height="25"
          >
            <path
              d="M426.666667 138.666667v746.666666a53.393333 53.393333 0 0 1-53.333334 53.333334H266.666667a53.393333 53.393333 0 0 1-53.333334-53.333334V138.666667a53.393333 53.393333 0 0 1 53.333334-53.333334h106.666666a53.393333 53.393333 0 0 1 53.333334 53.333334z m330.666666-53.333334H650.666667a53.393333 53.393333 0 0 0-53.333334 53.333334v746.666666a53.393333 53.393333 0 0 0 53.333334 53.333334h106.666666a53.393333 53.393333 0 0 0 53.333334-53.333334V138.666667a53.393333 53.393333 0 0 0-53.333334-53.333334z"
              fill="#ffffff"
              p-id="1402"
            ></path>
          </svg>
        )}
      </div>
      <TimeStamp VideoInfo={props.VideoInfo}></TimeStamp>
    </Wrap>
  );
};

export default Control;
