import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import { goToPx } from '../utils/mouse';
const Wrap = styled.div`
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 20px;
  z-index: 3;
`;

type Props = {
  wrapLeft: number;
  goto: (px: number) => void;
  showVideoDetail: (px: number) => void;
  progressWidth: number;
};
//@ts-ignore
const ProgressBar = (props: Props) => {
  const [barState, setBarState] = useState([
    {
      height: '2px',
      width: '100%',
      type: 'Bar',
      zIndex: 2,
      top: '-1px',
      color: '#d2d2d265',
    },
    {
      height: '2px',
      width: '80%',
      type: 'BufferBar',
      zIndex: 3,
      top: '-1px',
      color: '#ececec',
    },
    {
      height: '2px',
      width: '50%',
      type: 'ProgressBar',
      zIndex: 4,
      top: '-1px',
      color: '#ff5e8b',
    },
  ]);

  // 鼠标点击bar
  const goTo = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let res = await goToPx(props.wrapLeft, e.pageX);
    await props.goto(res);
    let newBarState = barState.map(item => {
      if (item.type === 'ProgressBar') {
        item.width = res + 'px';
      }
      return item;
    });
    setBarState(newBarState);
  };

  // 鼠标在bar内移动
  const moveToBarShowDetail = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    let res = await goToPx(props.wrapLeft, e.pageX);
    props.showVideoDetail(res);
  };

  // 监听由上层传来的progress进度变化
  useEffect(() => {
    let newBarState = barState.map(item => {
      if (item.type === 'ProgressBar') {
        item.width = props.progressWidth + 'px';
      }
      return item;
    });
    setBarState(newBarState);
  }, [props.progressWidth]);

  return (
    <Wrap
      onMouseDown={e => {
        goTo(e);
      }}
      onMouseMove={e => moveToBarShowDetail(e)}
    >
      {barState.map(item => {
        return (
          <div
            key={nanoid()}
            style={{
              width: item.width,
              height: item.height,
              backgroundColor: item.color,
              zIndex: item.zIndex,
              position: 'absolute',
            }}
          ></div>
        );
      })}
    </Wrap>
  );
};

export default ProgressBar;
