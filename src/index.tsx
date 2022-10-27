import React, { useState, useRef, useEffect } from 'react';
import Play from './components/Play';
import Pause from './components/Pause';
import {
  Wrap,
  Video,
  Control,
  StampTime,
  Bar,
  BackBar,
  ProgressBar,
  BufferBar,
  DetailVideo,
} from './style';
import { formatTime, forwordPxToVideoTime, getDetailLeft } from './utils/time';
import { caculationCurrentSecondTopx, getForwordPx } from './utils/bar';
type Props = {
  high: string;
  long: string;
  videoUrl: string;
  minVideoUrl?: string;
  bufferColor?: string;
  progressColor?: string;
  backgroundFillColor?: string;
};

//@ts-ignore
export const ReactVideoPlayer = (props: Props) => {
  const [sharedState, setSharedState] = useState({
    height: props.high,
    width: props.long,
    offsetLeft: 0,
    offsetWidth: 0,
    duration: 0,
    formatDuration: '00:00:00',
    videoUrl: props.videoUrl,
    minVideoUrl: props.minVideoUrl || 'none',
    bufferColor: props.bufferColor || '#58a8e9',
    progressColor: props.progressColor || '#0d6efd',
    background: props.backgroundFillColor || 'black',
  });
  const wrapRef = useRef(null) as React.RefObject<HTMLDivElement> | null;
  const videoRef = useRef(null) as React.RefObject<HTMLVideoElement> | null;
  const DetailVideoRef = useRef(null) as React.RefObject<
    HTMLVideoElement
  > | null;
  const [flag, setFlag] = useState({
    isPlay: false,
    formatCurrentTime: '00:00:00',
    isEnterBar: false,
    isCurrentClickBar: false,
  });
  const [barState, setBarState] = useState({
    height: '2px',
    bufferWidth: '0px',
    progressWidth: '0px',
  });
  const [DetailVideoState, setDetailVideoState] = useState({
    display: 'none',
    left: '0px',
    currentTime: 0,
  });

  // 播放暂停
  const playOrPause = () => {
    if (videoRef !== null && videoRef.current) {
      // 暂停
      let flagCopy = { ...flag };
      if (flag.isPlay) {
        videoRef.current.pause();
        flagCopy.isPlay = false;
        setFlag(flagCopy);
      } else {
        // 播放
        videoRef.current.play();
        flagCopy.isPlay = true;
        setFlag(flagCopy);
      }
    }
  };

  // 视频加载第一帧后获取各种信息
  const getInfo = async () => {
    if (
      wrapRef !== null &&
      wrapRef.current &&
      videoRef !== null &&
      videoRef.current
    ) {
      let shared = { ...sharedState };
      shared.offsetLeft = wrapRef.current.offsetLeft;
      shared.offsetWidth = wrapRef.current.offsetWidth;
      shared.duration = videoRef.current.duration;
      shared.formatDuration = await formatTime(videoRef.current.duration);
      setSharedState(shared);
    }
  };

  // 更新当前时间到屏幕
  const updateCurrent = async () => {
    if (flag.isCurrentClickBar) return;
    if (videoRef !== null && videoRef.current) {
      let flagCopy = { ...flag };
      flagCopy.formatCurrentTime = await formatTime(
        videoRef.current.currentTime
      );
      setFlag(flagCopy);
    }
  };

  // 更新进度条
  const updateProgressBar = () => {
    if (flag.isCurrentClickBar) return;
    if (
      videoRef !== null &&
      videoRef.current &&
      wrapRef !== null &&
      wrapRef.current
    ) {
      let res = caculationCurrentSecondTopx(
        videoRef.current.duration,
        videoRef.current.currentTime
      );
      let BarStateCopy = { ...barState };
      BarStateCopy.progressWidth = res + '%';
      setBarState(BarStateCopy);
    }
  };

  // 更新缓冲条
  const updateBufferBar = () => {
    if (videoRef !== null && videoRef.current) {
      let BarStateCopy = { ...barState };
      BarStateCopy.bufferWidth =
        (videoRef.current.buffered.end(videoRef.current.buffered.length - 1) /
          videoRef.current.duration) *
          100 +
        '%';
      setBarState(BarStateCopy);
    }
  };

  // 播放结束
  const playEnd = () => {
    let flagCopy = { ...flag };
    flagCopy.isPlay = false;
    setFlag(flagCopy);
  };

  /**
   * bar相关
   */
  const mouseEnterBar = () => {
    let flagCopy = { ...flag };
    flagCopy.isEnterBar = true;
    let barStateCopy = { ...barState };
    barStateCopy.height = '4px';
    setBarState(barStateCopy);
    setFlag(flagCopy);
  };

  const mouseLeaveBar = () => {
    if (!flag.isEnterBar) return;
    let flagCopy = { ...flag };
    flagCopy.isEnterBar = false;
    let barStateCopy = { ...barState };
    barStateCopy.height = '2px';
    let DetailVideoStateCopy = { ...DetailVideoState };
    DetailVideoStateCopy.display = 'none';
    setDetailVideoState(DetailVideoStateCopy);
    setBarState(barStateCopy);
    setFlag(flagCopy);
  };

  const mouseInBarMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!flag.isEnterBar) return false;
    if (DetailVideoRef !== null && DetailVideoRef.current) {
      let res = getDetailLeft(sharedState.offsetLeft + 20, e.pageX);
      let px = getForwordPx(sharedState.offsetLeft + 20, e.pageX);
      let time = forwordPxToVideoTime(
        px,
        sharedState.duration,
        sharedState.offsetWidth - 40
      );
      let DetailVideoStateCopy = { ...DetailVideoState };
      DetailVideoRef.current.currentTime = time;
      DetailVideoStateCopy.left = res + 'px';
      DetailVideoStateCopy.display = 'block';
      setDetailVideoState(DetailVideoStateCopy);
    }
    return false;
  };

  const mouseDownBar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let flagCopy = { ...flag };
    flagCopy.isCurrentClickBar = true;
    setFlag(flagCopy);
    let BarStateCopy = { ...barState };
    let px = getForwordPx(sharedState.offsetLeft + 20, e.pageX);
    BarStateCopy.progressWidth = px + 'px';
    setBarState(BarStateCopy);
    let time = forwordPxToVideoTime(
      px,
      sharedState.duration,
      sharedState.offsetWidth - sharedState.offsetLeft - 40
    );
    if (videoRef !== null && videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const mouseUpBar = () => {
    let flagCopy = { ...flag };
    flagCopy.isCurrentClickBar = false;
    if (flag.isPlay === false) {
      flagCopy.isPlay = true;
      if (videoRef !== null && videoRef.current) {
        videoRef.current.play();
      }
    }
    setFlag(flagCopy);
  };

  useEffect(() => {
    window.onkeydown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          break;
      }
    };
    window.onresize = () => {
      getInfo();
    };
    // clear cyle
    return () => {
      window.onkeydown = null;
      window.onresize = null;
    };
  }, []);

  return (
    <Wrap
      style={{
        height: sharedState.height,
        width: sharedState.width,
        backgroundColor: sharedState.background,
      }}
      ref={wrapRef}
    >
      {/* 视频 */}
      <Video
        style={{ height: sharedState.height, width: sharedState.width }}
        muted
        ref={videoRef}
        onClick={playOrPause}
        onLoadedData={getInfo}
        onTimeUpdate={() => {
          updateCurrent();
          updateProgressBar();
        }}
        onProgress={updateBufferBar}
        onEnded={playEnd}
      >
        <source src={sharedState.videoUrl} />
      </Video>
      {/* 缩略图 */}
      <DetailVideo
        ref={DetailVideoRef}
        muted
        style={{
          left: DetailVideoState.left,
          display: DetailVideoState.display,
        }}
      >
        <source src={sharedState.minVideoUrl} />
      </DetailVideo>
      {/* 进度条 */}
      <Bar
        onMouseEnter={mouseEnterBar}
        onMouseLeave={mouseLeaveBar}
        onMouseMove={e => {
          mouseInBarMove(e);
        }}
        onMouseDown={e => {
          mouseDownBar(e);
        }}
        onMouseUp={mouseUpBar}
      >
        {/* 进度条 */}
        <ProgressBar
          style={{
            width: barState.progressWidth,
            height: barState.height,
            backgroundColor: sharedState.progressColor,
          }}
        ></ProgressBar>
        {/* 缓冲条 */}
        <BufferBar
          style={{
            width: barState.bufferWidth,
            height: barState.height,
            backgroundColor: sharedState.bufferColor,
          }}
        ></BufferBar>
        {/* 背景条 */}
        <BackBar style={{ height: barState.height }}></BackBar>
      </Bar>
      {/* 控制台 */}
      <Control>
        <div onClick={playOrPause}>
          {flag.isPlay ? <Pause></Pause> : <Play></Play>}
        </div>
        <StampTime>
          {flag.formatCurrentTime} / {sharedState.formatDuration}
        </StampTime>
      </Control>
    </Wrap>
  );
};
