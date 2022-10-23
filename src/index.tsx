import React, { useEffect, useRef, useState } from 'react';
import {
  Wrap,
  Video,
  VolumeBack,
  Volume,
  Control,
  Bar,
  Timestamp,
  QuickVideo,
  FullScreen,
} from './style';
import { syncProgress, mouseInBar, barRelatedTime } from './utils/handlerBar';
import { formatTime } from './utils/handlerTime';

type Props = {
  high: string;
  long: string;
};
//@ts-ignore
export const ReactVideoPlayer = (props: Props) => {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const enterFlag = useRef(false);
  const quickRef = useRef(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [fullScreen, setFullScreen] = useState(false);
  const videoHeightWidthCopy = useRef({ width: '0', height: '0' });
  const bufferCopy = useRef(0);
  //@ts-ignore
  const [videoState, setVideoState] = useState({
    height: props.high,
    width: props.long,
    currentTime: '00:00',
    duration: '00:00',
    isPlay: false,
  });

  //@ts-ignore
  const [barState, setBarState] = useState([
    {
      height: '3px',
      width: '100%',
      type: 'Bar',
      zIndex: 2,
      top: '-1px',
      color: '#d2d2d265',
    },
    {
      height: '3px',
      width: '0%',
      type: 'BufferBar',
      zIndex: 3,
      top: '-1px',
      color: '#ececec',
    },
    {
      height: '3px',
      width: '0%',
      type: 'ProgressBar',
      zIndex: 4,
      top: '-1px',
      color: '#ff5e8b',
    },
  ]);

  //@ts-ignore
  const [quickVideo, setQuickVideo] = useState({
    left: 0,
    opacity: 0,
  });

  // 音量
  const volume = useRef(1);
  const [renderVolume, setRenderVolume] = useState('10%');
  //@ts-ignore
  const [renderVolumeShow, setRenderVolumeShow] = useState(0);

  // 播放
  const play = () => {
    (videoRef as any).current.play();
    setVideoState({
      height: videoState.height,
      width: videoState.width,
      currentTime: videoState.currentTime,
      duration: videoState.duration,
      isPlay: true,
    });
  };

  // 暂停
  const pause = () => {
    (videoRef as any).current.pause();
    videoState.isPlay = false;
    setVideoState({
      height: videoState.height,
      width: videoState.width,
      currentTime: videoState.currentTime,
      duration: videoState.duration,
      isPlay: false,
    });
  };

  // 视频正在播放
  const playingSyncProgressBar = () => {
    let goForwardPx = syncProgress(
      (videoRef as any).current.currentTime,
      (videoRef as any).current.offsetWidth,
      (videoRef as any).current.duration
    );
    let res = barState.map(item => {
      if (item.type === 'ProgressBar') {
        item.width = goForwardPx;
      }
      return item;
    });
    setBarState(res);
    // 更新显示的时间
    let playedTime = formatTime((videoRef as any).current.currentTime);
    let totalTime = formatTime((videoRef as any).current.duration);
    setVideoState({
      height: videoState.height,
      width: videoState.width,
      currentTime: playedTime,
      duration: totalTime,
      isPlay: videoState.isPlay,
    });
  };

  // 监听视频缓冲
  const Buffering = () => {
    actionObserverKeyPress();
    let buffer = (videoRef as any).current.buffered.end(
      (videoRef as any).current.buffered.length - 1
    );
    bufferCopy.current = buffer;
    let goForwardPx = syncProgress(
      buffer,
      (videoRef as any).current.offsetWidth,
      (videoRef as any).current.duration
    );
    let res = barState.map(item => {
      if (item.type === 'BufferBar') {
        item.width = goForwardPx;
      }
      return item;
    });
    setBarState(res);
  };

  // 监听视频播放结束
  const playEnd = () => {
    videoState.isPlay = false;
    setVideoState({
      height: videoState.height,
      width: videoState.width,
      currentTime: videoState.currentTime,
      duration: videoState.duration,
      isPlay: false,
    });
  };

  // 鼠标移入
  const mouseEnter = () => {
    enterFlag.current = true;
    // 进度条高亮
    let res = barState.map(item => {
      item.height = '5px';
      item.top = '-2px';
      return item;
    });
    setBarState(res);
  };

  // 鼠标离开
  const mouseLeave = () => {
    enterFlag.current = false;
    // 取消进度条高亮
    let res = barState.map(item => {
      item.height = '3px';
      item.top = '-1px';
      return item;
    });
    setBarState(res);
    setQuickVideo({ left: quickVideo.left, opacity: 0 });
  };

  // 鼠标移动
  //@ts-ignore
  const mouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!enterFlag.current) return;
    // 进度条高亮
    let res = barState.map(item => {
      item.height = '5px';
      item.top = '-2px';
      return item;
    });
    setBarState(res);
    let goForwardPx: number = mouseInBar(
      e.pageX,
      (videoRef as any).current.offsetWidth,
      (videoRef as any).current.offsetLeft
    );
    let goToTimeRes = barRelatedTime(
      e.pageX,
      (videoRef as any).current.offsetWidth,
      (videoRef as any).current.offsetLeft,
      (videoRef as any).current.duration
    );
    (quickRef as any).current.currentTime = goToTimeRes;
    setQuickVideo({ left: goForwardPx, opacity: 1 });
  };

  // 鼠标点击
  const clickBar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!enterFlag.current) return;
    let goForwardPx: number = mouseInBar(
      e.pageX,
      (videoRef as any).current.offsetWidth,
      (videoRef as any).current.offsetLeft
    );
    let res = barState.map(item => {
      if (item.type === 'ProgressBar') {
        item.width = goForwardPx + 'px';
      }
      return item;
    });
    setBarState(res);
    let goToTimeRes = barRelatedTime(
      e.pageX,
      (videoRef as any).current.offsetWidth,
      (videoRef as any).current.offsetLeft,
      (videoRef as any).current.duration
    );
    (videoRef as any).current.currentTime = goToTimeRes;
  };

  // 加减音量
  const settingVolume = (type: boolean) => {
    if (timer.current != null) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      setRenderVolumeShow(0);
    }, 1000);
    setRenderVolumeShow(1);
    if (!type) {
      if (volume.current === 0) {
        setRenderVolume('静音');
        return;
      }
      if (volume.current - 1 === 0) {
        setRenderVolume('静音');
        (videoRef as any).current.muted = true;
        volume.current -= 1;
        (videoRef as any).current.volume = volume.current / 10;
      } else {
        volume.current -= 1;
        (videoRef as any).current.volume = volume.current / 10;
        setRenderVolume(volume.current * 10 + '%');
      }
    } else {
      (videoRef as any).current.muted = false;
      if (volume.current === 10) return;
      volume.current += 1;
      (videoRef as any).current.volume = volume.current / 10;
      setRenderVolume(volume.current * 10 + '%');
    }
  };

  // 快进快退
  const fastForwardAndFastRewind = (type: boolean) => {
    console.log((videoRef as any).current.currentTime);
    if (type) {
      // 快进
      if (
        (videoRef as any).current.currentTime + 5 >
        (videoRef as any).current.duration
      ) {
        (videoRef as any).current.currentTime = (videoRef as any).current.duration;
      } else {
        (videoRef as any).current.currentTime += 5;
      }
    } else {
      // 快退
      if ((videoRef as any).current.currentTime - 5 < 1) {
        (videoRef as any).current.currentTime = 1;
      } else {
        (videoRef as any).current.currentTime -= 5;
      }
    }
  };

  // 开始监听方向键
  const actionObserverKeyPress = () => {
    window.addEventListener('keydown', e => {
      switch (e.code) {
        case 'ArrowUp':
          settingVolume(true);
          break;
        case 'ArrowDown':
          settingVolume(false);
          break;
        case 'ArrowLeft':
          fastForwardAndFastRewind(false);
          break;
        case 'ArrowRight':
          fastForwardAndFastRewind(true);
      }
    });
  };

  // 全屏 || 退出全屏
  function launchFullScreen(type: string) {
    if (type == 'full') {
      // 全屏
      videoHeightWidthCopy.current.height = videoState.height;
      videoHeightWidthCopy.current.width = videoState.width;
      setVideoState({
        height: 'calc(100vh)',
        width: 'calc(100vw)',
        currentTime: videoState.currentTime,
        duration: videoState.duration,
        isPlay: videoState.isPlay,
      });
      setFullScreen(true);
      let element: any = (wrapRef as any).current;
      if (element.requestFullScreen) {
        element.requestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      }
    } else {
      setVideoState({
        height: videoHeightWidthCopy.current.height,
        width: videoHeightWidthCopy.current.width,
        currentTime: videoState.currentTime,
        duration: videoState.duration,
        isPlay: videoState.isPlay,
      });
      setFullScreen(false);
      // 取消全屏
      if (document.exitFullscreen) {
        document.exitFullscreen();
        //@ts-ignore
      } else if (document.msExitFullscreen) {
        //@ts-ignore
        document.msExitFullscreen();
        //@ts-ignore
      } else if (document.mozCancelFullScreen) {
        //@ts-ignore
        document.mozCancelFullScreen();
        //@ts-ignore
      } else if (document.webkitExitFullscreen) {
        //@ts-ignore
        document.webkitExitFullscreen();
      }
    }
  }

  /**
   * 监听fullScreen的变化,如果fullScreen发送变化
   * 那么就说明需要更改进度条的长度已经缓存条的长度
   * 这一步主要就是sync一下进度条和缓冲条,因为video宽度发生了变化
   */
  useEffect(() => {
    let BuffergoForwardPx = syncProgress(
      bufferCopy.current,
      (videoRef as any).current.offsetWidth,
      (videoRef as any).current.duration
    );
    let goForwardPx = syncProgress(
      (videoRef as any).current.currentTime,
      (videoRef as any).current.offsetWidth,
      (videoRef as any).current.duration
    );
    let res = barState.map(item => {
      if (item.type === 'ProgressBar') {
        item.width = goForwardPx;
      }
      if (item.type === 'BufferBar') {
        item.width = BuffergoForwardPx;
      }
      return item;
    });
    setBarState(res);
  }, [fullScreen]);

  useEffect(() => {
    if (volume.current !== 0) {
      (videoRef as any).current.muted = false;
      (videoRef as any).current.volume = volume.current / 10;
    }
  }, []);

  return (
    <Wrap
      style={{ height: videoState.height, width: videoState.width }}
      ref={wrapRef}
    >
      {/* 视频 */}
      <Video
        style={{ height: videoState.height, width: videoState.width }}
        ref={videoRef}
        muted
        preload="meta"
        onTimeUpdate={playingSyncProgressBar}
        onProgress={Buffering}
        onEnded={playEnd}
      >
        <source type="video/mp4" src="https://bezos.life/download.mp4"></source>
      </Video>
      {/* 音量显示 */}
      <VolumeBack>
        <Volume style={{ opacity: renderVolumeShow }}>
          {renderVolume === '静音' ? (
            <svg
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="6518"
              width="30"
              height="30"
            >
              <path
                d="M225.680461 326.598406c-0.419556-0.019443-0.818645-0.019443-1.237177-0.019443L101.812315 326.578963c-22.753213 0-40.876989 18.24248-40.876989 40.777729l0 286.336424c0 22.534226 18.302855 40.777729 40.876989 40.777729l122.629945 0c0.079818 0 0.119727 0 0.198521 0l0 0.157589 300.289204 194.444551c7.125281 6.108115 16.405645 9.781784 26.526143 9.781784 22.573111 0 40.874943-18.301831 40.874943-40.878013 0-1.87572-0.119727-3.711532-0.360204-5.509481L591.970868 168.58151c0.239454-1.795902 0.360204-3.632737 0.360204-5.509481 0-22.574135-18.302855-40.876989-40.874943-40.876989-9.301853 0-17.884322 3.113921-24.750707 8.343015L225.680461 326.598406zM859.567485 510.524392l91.952248-91.951225c11.495822-11.517311 11.576663-30.558993-0.13917-42.274826-11.795651-11.795651-30.636764-11.755742-42.273802-0.140193l-91.953272 91.953272-91.950202-91.953272c-11.639085-11.616572-30.479175-11.655458-42.275849 0.140193-11.715833 11.715833-11.633968 30.757514-0.13917 42.274826l91.952248 91.951225-91.952248 91.953272c-11.494799 11.515265-11.576663 30.556946 0.13917 42.272779 11.796674 11.796674 30.636764 11.756765 42.275849 0.140193l91.950202-91.951225 91.953272 91.951225c11.636015 11.617595 30.477129 11.657504 42.273802-0.140193 11.715833-11.714809 11.634991-30.757514 0.13917-42.272779L859.567485 510.524392z"
                p-id="6519"
                fill="#000000"
              ></path>
            </svg>
          ) : (
            <svg
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5477"
              width="30"
              height="30"
            >
              <path
                d="M260.256 356.576l204.288-163.968a32 32 0 0 1 52.032 24.96v610.432a32 32 0 0 1-51.968 24.992l-209.92-167.552H96a32 32 0 0 1-32-32v-264.864a32 32 0 0 1 32-32h164.256zM670.784 720.128a32 32 0 0 1-44.832-45.664 214.08 214.08 0 0 0 64.32-153.312 213.92 213.92 0 0 0-55.776-144.448 32 32 0 1 1 47.36-43.04 277.92 277.92 0 0 1 72.416 187.488 278.08 278.08 0 0 1-83.488 198.976zM822.912 858.88a32 32 0 1 1-45.888-44.608A419.008 419.008 0 0 0 896 521.152c0-108.704-41.376-210.848-114.432-288.384a32 32 0 0 1 46.592-43.872c84.16 89.28 131.84 207.04 131.84 332.256 0 127.84-49.76 247.904-137.088 337.728z"
                p-id="5478"
                fill="#000"
              ></path>
            </svg>
          )}
          {renderVolume}
        </Volume>
      </VolumeBack>
      {/* 控制台 */}
      <Control>
        <div
          onMouseEnter={mouseEnter}
          onMouseMove={e => mouseMove(e)}
          onMouseLeave={mouseLeave}
          onClick={e => clickBar(e)}
        >
          {barState.map(item => {
            return (
              <Bar
                style={{
                  height: item.height,
                  width: item.width,
                  top: item.top,
                  zIndex: item.zIndex,
                  backgroundColor: item.color,
                }}
                key={item.type}
              ></Bar>
            );
          })}
        </div>
        {/*缩略视频 */}
        <QuickVideo
          ref={quickRef}
          muted
          preload="meta"
          style={{
            left: quickVideo.left - 75 + 'px',
            opacity: quickVideo.opacity,
          }}
        >
          <source
            type="video/mp4"
            src="https://bezos.life/download-min.mp4"
          ></source>
        </QuickVideo>
        {/* 播放暂停 */}
        <div>
          {videoState.isPlay ? (
            <svg
              onClick={pause}
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2405"
              width="25"
              height="25"
            >
              <path
                d="M426.666667 138.666667v746.666666a53.393333 53.393333 0 0 1-53.333334 53.333334H266.666667a53.393333 53.393333 0 0 1-53.333334-53.333334V138.666667a53.393333 53.393333 0 0 1 53.333334-53.333334h106.666666a53.393333 53.393333 0 0 1 53.333334 53.333334z m330.666666-53.333334H650.666667a53.393333 53.393333 0 0 0-53.333334 53.333334v746.666666a53.393333 53.393333 0 0 0 53.333334 53.333334h106.666666a53.393333 53.393333 0 0 0 53.333334-53.333334V138.666667a53.393333 53.393333 0 0 0-53.333334-53.333334z"
                fill="#ffffff"
                p-id="2406"
              ></path>
            </svg>
          ) : (
            <svg
              onClick={play}
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1389"
              width="25"
              height="25"
            >
              <path
                d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z"
                fill="#ffffff"
                p-id="1390"
              ></path>
            </svg>
          )}
        </div>
        {/* 时间戳 */}
        <Timestamp>
          {videoState.currentTime}&nbsp;/&nbsp;{videoState.duration}
        </Timestamp>
        <FullScreen>
          {fullScreen ? (
            <svg
              onClick={() => {
                launchFullScreen('cancelFull');
              }}
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7853"
              width="30"
              height="30"
            >
              <path
                d="M298.666667 631.466667H226.133333v-81.066667h217.6v204.8h-85.333333v-68.266667l-128 128L170.666667 759.466667l128-128z m422.4 0l128 128-59.733334 59.733333-128-128v68.266667h-85.333333V554.666667h217.6v81.066666h-72.533333zM298.666667 341.333333L187.733333 230.4 243.2 170.666667l115.2 115.2V217.6h85.333333v204.8H226.133333V341.333333H298.666667z m430.933333 0h64v81.066667h-217.6V217.6h85.333333v72.533333L780.8 170.666667l59.733333 59.733333L729.6 341.333333z"
                fill="#ffffff"
                p-id="7854"
              ></path>
            </svg>
          ) : (
            <svg
              onClick={() => {
                launchFullScreen('full');
              }}
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7602"
              width="30"
              height="30"
            >
              <path
                d="M358.4 768H426.666667v85.333333H213.333333v-213.333333h85.333334v68.266667l128-128 59.733333 59.733333-128 128z m345.6 0l-128-128 59.733333-59.733333 132.266667 132.266666V640h85.333333v213.333333h-213.333333v-85.333333h64zM358.4 298.666667l128 128-59.733333 59.733333-128-128V426.666667H213.333333V213.333333h213.333334v85.333334H358.4z m345.6 0H640V213.333333h213.333333v213.333334h-85.333333V354.133333l-132.266667 132.266667-59.733333-59.733333 128-128z"
                fill="#ffffff"
                p-id="7603"
              ></path>
            </svg>
          )}
        </FullScreen>
      </Control>
    </Wrap>
  );
};
