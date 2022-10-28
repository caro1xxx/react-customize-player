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
  Load,
  Loading,
  VolumeBack,
  Volume,
  ControlVolume,
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
    formatCurrentTime: '00:00:00',
    isEnterBar: false,
    isCurrentClickBar: false,
    isWaitBuffer: false,
    volume: 0,
    isShowVolume: 0,
  });
  const [isPlay, setIsPlay] = useState(false);
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

  const [nonStateDep, setNonStateDep] = useState({
    isShowVolumeBack: false,
    isShowLoadingBack: false,
  });

  const timer = useRef({ volumeTimer: null as null | NodeJS.Timeout });

  // 播放暂停
  const playOrPause = () => {
    if (videoRef !== null && videoRef.current) {
      // 暂停
      let flagCopy = { ...flag };
      if (isPlay) {
        videoRef.current.pause();
        setIsPlay(false);
      } else {
        // 播放
        videoRef.current.play();
        setIsPlay(true);
      }
      flagCopy.volume = videoRef.current.volume;
      setFlag(flagCopy);
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
      let flagCopy = { ...flag };
      flagCopy.volume = videoRef.current.volume;
      videoRef.current.pause();
      setIsPlay(false);
      setFlag(flagCopy);
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
    setIsPlay(false);
    setFlag(flagCopy);
  };

  // 等待缓冲
  const waitLoadVideo = () => {
    if (videoRef !== null && videoRef.current) {
      // 暂停
      let flagCopy = { ...flag };
      setIsPlay(false);
      flagCopy.isWaitBuffer = true;
      setFlag(flagCopy);
      let nonStateDepCopy = { ...nonStateDep };
      nonStateDepCopy.isShowLoadingBack = true;
      setNonStateDep(nonStateDepCopy);
    }
  };

  // 等待缓存结束
  const waitEnd = () => {
    if (videoRef !== null && videoRef.current) {
      // 暂停
      let flagCopy = { ...flag };
      setIsPlay(true);
      flagCopy.isWaitBuffer = false;
      setFlag(flagCopy);
      let nonStateDepCopy = { ...nonStateDep };
      nonStateDepCopy.isShowLoadingBack = false;
      setNonStateDep(nonStateDepCopy);
    }
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
    if (isPlay === false) {
      setIsPlay(true);
      if (videoRef !== null && videoRef.current) {
        videoRef.current.play();
      }
    }
    setFlag(flagCopy);
  };

  /**
   * 音量控制
   */
  const increaseVolume = () => {
    if (videoRef !== null && videoRef.current) {
      videoRef.current.muted = false;
      if (videoRef.current.volume === 1) {
      } else {
        videoRef.current.volume = (videoRef.current.volume * 10 + 1) / 10;
      }
      let flagCopy = { ...flag };
      flagCopy.volume = videoRef.current.volume;
      setFlag(flagCopy);
    }
  };
  const decreaseVolume = () => {
    if (videoRef !== null && videoRef.current) {
      videoRef.current.muted = false;
      if (videoRef.current.volume === 0) {
        if (!videoRef.current.muted) {
          videoRef.current.muted = true;
        }
      } else {
        videoRef.current.volume = (videoRef.current.volume * 10 - 1) / 10;
      }
      let flagCopy = { ...flag };
      flagCopy.volume = videoRef.current.volume;
      setFlag(flagCopy);
    }
  };
  const volumeChange = () => {
    if (!nonStateDep.isShowVolumeBack) {
      let nonStateDepCopy = { ...nonStateDep };
      nonStateDepCopy.isShowVolumeBack = true;
      setNonStateDep(nonStateDepCopy);
    }
    if (timer.current.volumeTimer) {
      clearTimeout(timer.current.volumeTimer);
    }
    timer.current.volumeTimer = setTimeout(() => {
      let nonStateDepCopy = { ...nonStateDep };
      nonStateDepCopy.isShowVolumeBack = false;
      setNonStateDep(nonStateDepCopy);
    }, 2000);
  };

  useEffect(() => {
    window.onkeydown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          break;
        case 'ArrowUp':
          increaseVolume();
          break;
        case 'ArrowDown':
          decreaseVolume();
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
        ref={videoRef}
        onClick={playOrPause}
        onLoadedData={getInfo}
        onTimeUpdate={() => {
          updateCurrent();
          updateProgressBar();
        }}
        onProgress={updateBufferBar}
        onEnded={playEnd}
        onWaiting={waitLoadVideo}
        onPlaying={waitEnd}
        onVolumeChange={volumeChange}
      >
        <source src={sharedState.videoUrl} />
      </Video>
      {/* 音量选项 */}
      {/* <VolumeOptions></VolumeOptions> */}

      {/* 音量 */}
      {nonStateDep.isShowVolumeBack ? (
        <VolumeBack>
          <Volume>
            {flag.volume === 0 ? (
              <svg
                className="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1770"
                width="30"
                height="30"
              >
                <path
                  d="M0.002433 672V352a53.393333 53.393333 0 0 1 53.333334-53.333333h172.5l207.08-207.086667A21.333333 21.333333 0 0 1 469.335767 106.666667v189.413333L41.435767 724A53.42 53.42 0 0 1 0.002433 672z m633.753334-452.42a21.333333 21.333333 0 0 0-30.173334 0l-597.333333 597.333333a21.333333 21.333333 0 0 0 30.173333 30.173334L158.1691 725.333333h67.666667l207.08 207.086667A21.333333 21.333333 0 0 0 469.335767 917.333333V414.166667l164.42-164.413334a21.333333 21.333333 0 0 0 0-30.173333z"
                  fill="#000000"
                  p-id="1771"
                ></path>
              </svg>
            ) : (
              <svg
                className="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1403"
                width="30"
                height="30"
              >
                <path
                  d="M260.256 356.576l204.288-163.968a32 32 0 0 1 52.032 24.96v610.432a32 32 0 0 1-51.968 24.992l-209.92-167.552H96a32 32 0 0 1-32-32v-264.864a32 32 0 0 1 32-32h164.256zM670.784 720.128a32 32 0 0 1-44.832-45.664 214.08 214.08 0 0 0 64.32-153.312 213.92 213.92 0 0 0-55.776-144.448 32 32 0 1 1 47.36-43.04 277.92 277.92 0 0 1 72.416 187.488 278.08 278.08 0 0 1-83.488 198.976zM822.912 858.88a32 32 0 1 1-45.888-44.608A419.008 419.008 0 0 0 896 521.152c0-108.704-41.376-210.848-114.432-288.384a32 32 0 0 1 46.592-43.872c84.16 89.28 131.84 207.04 131.84 332.256 0 127.84-49.76 247.904-137.088 337.728z"
                  p-id="1404"
                  fill="#000000"
                ></path>
              </svg>
            )}
            {flag.volume === 0 ? '静音' : flag.volume * 100 + '%'}
          </Volume>
        </VolumeBack>
      ) : null}

      {/* loading */}
      {nonStateDep.isShowLoadingBack ? (
        <Load>{flag.isWaitBuffer ? <Loading></Loading> : null}</Load>
      ) : null}

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
        {/* 播放 暂停 */}
        <div onClick={playOrPause}>
          {isPlay ? <Pause></Pause> : <Play></Play>}
        </div>
        {/* 时间戳 */}
        <StampTime>
          {flag.formatCurrentTime} / {sharedState.formatDuration}
        </StampTime>
        {/*音量 */}
        <ControlVolume>
          {flag.volume === 0 ? (
            <svg
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1770"
              width="20"
              height="20"
            >
              <path
                d="M0.002433 672V352a53.393333 53.393333 0 0 1 53.333334-53.333333h172.5l207.08-207.086667A21.333333 21.333333 0 0 1 469.335767 106.666667v189.413333L41.435767 724A53.42 53.42 0 0 1 0.002433 672z m633.753334-452.42a21.333333 21.333333 0 0 0-30.173334 0l-597.333333 597.333333a21.333333 21.333333 0 0 0 30.173333 30.173334L158.1691 725.333333h67.666667l207.08 207.086667A21.333333 21.333333 0 0 0 469.335767 917.333333V414.166667l164.42-164.413334a21.333333 21.333333 0 0 0 0-30.173333z"
                fill="#ffff"
                p-id="1771"
              ></path>
            </svg>
          ) : (
            <svg
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1403"
              width="20"
              height="20"
            >
              <path
                d="M260.256 356.576l204.288-163.968a32 32 0 0 1 52.032 24.96v610.432a32 32 0 0 1-51.968 24.992l-209.92-167.552H96a32 32 0 0 1-32-32v-264.864a32 32 0 0 1 32-32h164.256zM670.784 720.128a32 32 0 0 1-44.832-45.664 214.08 214.08 0 0 0 64.32-153.312 213.92 213.92 0 0 0-55.776-144.448 32 32 0 1 1 47.36-43.04 277.92 277.92 0 0 1 72.416 187.488 278.08 278.08 0 0 1-83.488 198.976zM822.912 858.88a32 32 0 1 1-45.888-44.608A419.008 419.008 0 0 0 896 521.152c0-108.704-41.376-210.848-114.432-288.384a32 32 0 0 1 46.592-43.872c84.16 89.28 131.84 207.04 131.84 332.256 0 127.84-49.76 247.904-137.088 337.728z"
                p-id="1404"
                fill="#ffff"
              ></path>
            </svg>
          )}
        </ControlVolume>
      </Control>
    </Wrap>
  );
};
