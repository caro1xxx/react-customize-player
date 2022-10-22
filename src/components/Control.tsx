import React, { useRef } from 'react';
import styled from 'styled-components';
import ProgresBar from './ProgresBar';
import Thumbnail from './Thumbnail';
import {
  videoProcseeBarLong,
  getMousePxInVideoTime,
  getMouseInBarPx,
} from '../utils/handlerVideo';
import { nanoid } from 'nanoid';
const Wrap = styled.div`
  position: absolute;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.542));
  z-index: 100;
  height: 60px;
  left: 0px;
  width: 100%;
  bottom: 0;
  color: white;
`;

type Props = {
  videoFormatTotalTime: string;
  videoToatlTime: number;
  videoBoxWidth: number;
  videoBoxLeft: number;
  changeCurrentTime: (time: number) => void;
};

const Control = (props: Props) => {
  const [lineStyle, setLineStyle] = React.useState({
    data: [
      { long: '96%', high: '3px', color: '#efefef', zIndex: 2, top: '-1px' },
      { long: '50%', high: '3px', color: '#ffd3df', zIndex: 3, top: '-1px' },
      { long: '20%', high: '3px', color: '#fb7299', zIndex: 4, top: '-1px' },
    ],
  });

  //@ts-ignore
  const [thumbnail, setThumbnail] = React.useState({
    isDisplay: 'none',
    coordinates: 0,
    time: 0,
  });

  const isInProgresBarFlag = useRef(false);
  const mouseInBarPx = useRef<number>(0);

  // 鼠标进入
  const mouseEnter = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (isInProgresBarFlag.current) return;
    isInProgresBarFlag.current = true;
    // 高亮进度条
    let barHeigLight = lineStyle.data.map(item => {
      item.top = '-2px';
      item.high = '5px';
      return item;
    });
    setLineStyle({
      data: barHeigLight,
    });
    let barLong: number = await videoProcseeBarLong(props.videoBoxWidth);
    // 用计算到的鼠标当前px减去视频包裹元素的left就是鼠标处于视频的px
    let mousePos = await getMouseInBarPx(e.pageX, barLong);
    mouseInBarPx.current = mousePos - props.videoBoxLeft;
    // 开启缩略图
    setThumbnail({
      isDisplay: 'block',
      coordinates: mousePos,
      time: thumbnail.time,
    });
    return;
  };

  // 鼠标移出
  const mouseLeave = () => {
    if (!isInProgresBarFlag.current) return;
    isInProgresBarFlag.current = false;
    // 取消进度条高亮
    let barCancelHeigLight = lineStyle.data.map(item => {
      item.top = '-1px';
      item.high = '3px';
      return item;
    });
    setLineStyle({
      data: barCancelHeigLight,
    });
    // 关闭缩略图
    setThumbnail({
      isDisplay: 'none',
      coordinates: thumbnail.coordinates,
      time: thumbnail.time,
    });
  };

  // 鼠标在进度条内移动
  const mouseMoveInProgresBar = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!isInProgresBarFlag.current) return;
    let barLong: number = await videoProcseeBarLong(props.videoBoxWidth);
    // 用计算到的鼠标当前px减去视频包裹元素的left就是鼠标处于视频的px
    let mousePos = await getMouseInBarPx(e.pageX, barLong);
    mouseInBarPx.current = mousePos - props.videoBoxLeft;
    // 获取当前鼠标位置对应的视频时间
    let currentMouseToTime: number = await getMousePxInVideoTime(
      props.videoToatlTime,
      mouseInBarPx.current,
      barLong
    );
    // 开启缩略图
    setThumbnail({
      isDisplay: 'block',
      coordinates: mousePos,
      time: currentMouseToTime,
    });
    return;
  };

  // 点击进度条
  const clickProgressBar = async (
    //@ts-ignore
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!isInProgresBarFlag.current) return;
    // 高亮进度条
    let barHeigLight = lineStyle.data.map((item, index) => {
      if (index == 2) {
        item.long = mouseInBarPx.current + 'px';
      }
      return item;
    });
    let barLong: number = await videoProcseeBarLong(props.videoBoxWidth);
    //@ts-ignore
    // 获取当前鼠标位置对应的视频时间
    let currentMouseToTime: number = await getMousePxInVideoTime(
      props.videoToatlTime,
      mouseInBarPx.current,
      barLong
    );
    // 因为鼠标在进度条上点击了,那么就改变当前视频时间
    props.changeCurrentTime(currentMouseToTime);
    setLineStyle({
      data: barHeigLight,
    });
  };

  return (
    <Wrap>
      <div
        onMouseEnter={e => mouseEnter(e)}
        onMouseLeave={mouseLeave}
        onMouseMove={e => mouseMoveInProgresBar(e)}
        onClick={e => clickProgressBar(e)}
      >
        {/* 渲染缓存进度条,完整进度条,视频进度条 */}
        {lineStyle.data.map(item => {
          return <ProgresBar {...item} key={nanoid()}></ProgresBar>;
        })}
      </div>
      <Thumbnail
        display={thumbnail.isDisplay}
        coordinates={thumbnail.coordinates}
        time={thumbnail.time}
        leaveThum={mouseLeave}
      ></Thumbnail>
      {props.videoToatlTime}
    </Wrap>
  );
};

export default Control;
