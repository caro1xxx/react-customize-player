import React, { useEffect, useRef } from 'react';

type Props = {
  width: string;
  height: string;
  getVideoInfo: (info: number) => void;
  currentTime: number;
};

const Video = (props: Props) => {
  const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement | null>;

  const getVideoTotalTime = () => {
    props.getVideoInfo((videoRef as any).current.duration);
    return;
  };

  // 监听当前时间的变化
  useEffect(() => {
    (videoRef as any).current.currentTime = props.currentTime;
  }, [props.currentTime]);

  return (
    <video
      onLoadedData={getVideoTotalTime}
      ref={videoRef}
      muted
      preload="meta"
      style={{ width: props.width, height: props.height }}
    >
      <source type="video/mp4" src="https://bezos.life/download.mp4"></source>
    </video>
  );
};

export default Video;
