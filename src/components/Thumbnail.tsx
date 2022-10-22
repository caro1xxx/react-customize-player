import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Video = styled.video`
  position: absolute;
  z-index: 10;
  background-color: #fb729900;
  height: 100px;
  width: 150px;
  top: -100px;
`;

type Props = {
  display: string;
  coordinates: number;
  time: number;
  leaveThum: () => void;
};
//@ts-ignore
const Thumbnail = (props: Props) => {
  const thumbnailRef = useRef(null) as React.MutableRefObject<null>;
  const [thumbnailLeft, setThumbnailLeft] = useState(props.coordinates);
  useEffect(() => {
    (thumbnailRef as any).current.currentTime = props.time;
    setThumbnailLeft(
      props.coordinates - (thumbnailRef as any).current.offsetWidth / 3
    );
  }, [props.time]);
  return (
    <Video
      onMouseLeave={props.leaveThum}
      ref={thumbnailRef}
      style={{
        display: props.display,
        left: thumbnailLeft + 'px',
      }}
      muted
    >
      <source type="video/mp4" src="https://bezos.life/download.mp4"></source>
    </Video>
  );
};

export default Thumbnail;
