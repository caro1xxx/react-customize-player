import * as React from 'react';
import styled from 'styled-components';
import Video from './components/Video';
import Control from './components/Control';
import { videoTimeToFormatTime } from './utils/handlerVideo';

//@ts-ignore
const Wrap = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;
  background-color: black;
`;

type Props = {
  long?: string;
  high?: string;
};

export const ReactVideoPlayer = (props: Props) => {
  const videoBoxRef = React.useRef(null) as React.MutableRefObject<null>;
  //@ts-ignore
  const [videoInfo, setVideoInfo] = React.useState({
    videoFormatTotalTime: '00:00',
    videoToatlTime: 0,
    videoBoxWidth: 0,
    videoBoxLeft: 0,
    currentTime: 0,
  });
  // 获取视频总长度
  const videoInfoCallBack = async (info: number) => {
    let formatTime: string = await videoTimeToFormatTime(info);
    setVideoInfo({
      videoFormatTotalTime: formatTime,
      videoToatlTime: info,
      videoBoxWidth: videoInfo.videoBoxWidth,
      videoBoxLeft: videoInfo.videoBoxLeft,
      currentTime: videoInfo.currentTime,
    });
  };

  // 触发视频时间更新方法,改变state
  const changeVideoCurrentTime = (time: number) => {
    setVideoInfo({
      videoFormatTotalTime: videoInfo.videoFormatTotalTime,
      videoToatlTime: videoInfo.videoToatlTime,
      videoBoxWidth: videoInfo.videoBoxWidth,
      videoBoxLeft: videoInfo.videoBoxLeft,
      currentTime: time,
    });
    return;
  };

  // 获取视频高宽信息
  React.useLayoutEffect(() => {
    setVideoInfo({
      videoFormatTotalTime: videoInfo.videoFormatTotalTime,
      videoToatlTime: videoInfo.videoToatlTime,
      videoBoxWidth: (videoBoxRef as any).current.offsetWidth,
      videoBoxLeft: (videoBoxRef as any).current.offsetLeft,
      currentTime: videoInfo.currentTime,
    });
  }, []);

  return (
    // 获取视频包裹的这个元素ref,因为和视频本身的高宽不一致
    <Wrap ref={videoBoxRef} style={{ width: props.long, height: props.high }}>
      {/* 视频 */}
      <Video
        height={'100%'}
        width={'100%'}
        currentTime={videoInfo.currentTime}
        getVideoInfo={videoInfoCallBack}
      ></Video>
      {/* 控制台 */}
      <Control
        changeCurrentTime={changeVideoCurrentTime}
        videoBoxWidth={videoInfo.videoBoxWidth}
        videoFormatTotalTime={videoInfo.videoFormatTotalTime}
        videoToatlTime={videoInfo.videoToatlTime}
        videoBoxLeft={videoInfo.videoBoxLeft}
      ></Control>
    </Wrap>
  );
};
