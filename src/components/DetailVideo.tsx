import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Video = styled.video`
  height: 150px;
  width: 300px;
`;

type Props = {
  current: number;
};
//@ts-ignore
const DetailVideo = (props: Props) => {
  const DetailVideoRef = useRef(null) as React.RefObject<
    HTMLVideoElement
  > | null;

  useEffect(() => {
    if (
      !(
        (DetailVideoRef as React.RefObject<HTMLVideoElement>) &&
        DetailVideoRef?.current
      )
    )
      return;
    DetailVideoRef.current.currentTime = props.current;
  }, [props.current]);

  return (
    <Video muted preload="meta" ref={DetailVideoRef}>
      <source
        type="video/mp4"
        src="https://bezos.life/download-min.mp4"
      ></source>
    </Video>
  );
};

export default DetailVideo;
