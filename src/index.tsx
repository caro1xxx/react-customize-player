import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Control from './components/Control';
import { formatTime, autoPlayTime, gotoPxToTime } from './utils/Time';
import ProgressBar from './components/ProgressBar';
const Wrap = styled.div`
  position: relative;
  display: inline-block;
`;

const Video = styled.video`
  z-index: 1;
`;

type Props = {
  height: string;
  width: string;
  videoUrl: string;
};

// @ts-ignore
export const ReactVideoPlayer = (props: Props) => {
  const VideoRef = useRef(null) as React.RefObject<HTMLVideoElement> | null;
  const [warpInfo, setWrapInof] = useState({
    height: props.height,
    width: props.width,
    videoUrl: props.videoUrl,
    offleft: 0,
    realWith: 0,
  });
  const [PlayFlag, setPlayFlag] = useState(true);
  const [VideoInfo, setVideoInfo] = useState({
    currentTime: '00:00:00',
    duration: '00:00:00',
  });
  const [progressWidth, setProgressWidth] = useState(0);
  const videoForwardpx = useRef(0);
  const timeCache = useRef(0);
  // 监听页面点击事件
  const clickElement = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    if (!((VideoRef as React.RefObject<HTMLVideoElement>) && VideoRef?.current))
      return;
    // 播放||暂停
    if (e.target === VideoRef.current) {
      if (!PlayFlag) {
        VideoRef.current.pause();
        setPlayFlag(true);
      } else {
        VideoRef.current.play();
        setPlayFlag(false);
      }
    }
  };

  // 点击控制台中的播放
  const controlPlayVideo = () => {
    if (!((VideoRef as React.RefObject<HTMLVideoElement>) && VideoRef?.current))
      return;
    if (!PlayFlag) {
      VideoRef.current.pause();
      setPlayFlag(true);
    } else {
      VideoRef.current.play();
      setPlayFlag(false);
    }
  };

  // 正在播放中
  const playing = async () => {
    if (!((VideoRef as React.RefObject<HTMLVideoElement>) && VideoRef?.current))
      return;
    if (timeCache.current === parseInt(VideoRef.current.currentTime + ''))
      return;
    let progress = await autoPlayTime(
      videoForwardpx.current,
      progressWidth,
      VideoRef.current.duration,
      VideoRef.current.currentTime,
      warpInfo.realWith - 40
    );
    console.log(progress);
    let current = await formatTime(VideoRef.current.currentTime);
    setVideoInfo({
      currentTime: current,
      duration: VideoInfo.duration,
    });
    setProgressWidth(progress);
    timeCache.current = parseInt(VideoRef.current.currentTime + '');
  };

  // 获取视频总时长
  const getVideoDuration = async () => {
    if (!((VideoRef as React.RefObject<HTMLVideoElement>) && VideoRef?.current))
      return;
    let duration = await formatTime(VideoRef.current.duration);
    setVideoInfo({
      currentTime: VideoInfo.currentTime,
      duration: duration,
    });
    let wrap = document.getElementById('warpper');
    setWrapInof({
      height: warpInfo.height,
      width: warpInfo.width,
      videoUrl: warpInfo.videoUrl,
      offleft: (wrap as HTMLElement).offsetLeft,
      realWith: (wrap as HTMLElement).offsetWidth,
    });
  };

  // 跳转
  const goToDesignateTime = async (px: number) => {
    if (!((VideoRef as React.RefObject<HTMLVideoElement>) && VideoRef?.current))
      return;
    videoForwardpx.current = px;
    let res = await gotoPxToTime(
      warpInfo.realWith,
      px,
      VideoRef.current.duration
    );
    VideoRef.current.currentTime = res;
    setProgressWidth(px);
    return;
  };

  useEffect(() => {
    // 监听窗口变化
    window.onresize = () => {
      let wrap = document.getElementById('warpper');
      setWrapInof({
        height: warpInfo.height,
        width: warpInfo.width,
        videoUrl: warpInfo.videoUrl,
        offleft: (wrap as HTMLElement).offsetLeft,
        realWith: (wrap as HTMLElement).offsetWidth,
      });
    };
    // 监听键盘事件
    window.onkeydown = (e: KeyboardEvent) => {
      if (
        !((VideoRef as React.RefObject<HTMLVideoElement>) && VideoRef?.current)
      )
        return;
      switch (e.code) {
        case 'Space':
          controlPlayVideo();
          break;
      }
    };
    // clear event
    return () => {
      window.onresize = null;
      window.onkeydown = null;
    };
  });

  return (
    <Wrap
      id="warpper"
      onClick={e => {
        clickElement(e);
      }}
      style={{ height: warpInfo.height, width: warpInfo.width }}
    >
      <Video
        ref={VideoRef}
        muted
        preload="meta"
        style={{ height: warpInfo.height, width: warpInfo.width }}
        onTimeUpdate={playing}
        onLoadedData={getVideoDuration}
      >
        <source type="video/mp4" src={props.videoUrl}></source>
      </Video>
      <ProgressBar
        progressWidth={progressWidth}
        goto={goToDesignateTime}
        wrapLeft={warpInfo.offleft}
      ></ProgressBar>
      <Control
        isPlayFlag={PlayFlag}
        play={controlPlayVideo}
        VideoInfo={VideoInfo}
      ></Control>
    </Wrap>
  );
};
