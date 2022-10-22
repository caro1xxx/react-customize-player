// 格式化视频时间
export const videoTimeToFormatTime = (time: number) => {
  return new Promise(resolve => {
    resolve(time);
  })
    .then(value => {
      let time: number = value as number;
      let second: string, minutes: string;
      if (time < 59) {
        second =
          Number.parseInt(time + '') < 10
            ? '0' + Number.parseInt(time + '')
            : Number.parseInt(time + '') + '';
        minutes = '00';
      } else {
        minutes =
          Number.parseInt(time / 60 + '') < 10
            ? '0' + Number.parseInt(time / 60 + '')
            : Number.parseInt(time / 60 + '') + '';
        second =
          Number.parseInt((time % 60) + '') < 10
            ? '0' + Number.parseInt((time % 60) + '')
            : Number.parseInt((time % 60) + '') + '';
      }
      return minutes + ':' + second;
    })
    .catch(reason => {
      return reason;
    });
};

// 获取进度条的实际长度
export const videoProcseeBarLong = (offsetWidth: number) => {
  return new Promise(resolve => {
    resolve(offsetWidth);
  })
    .then(value => {
      return ((value as number) / 100) * 96;
    })
    .catch(reason => {
      return reason;
    });
};

// 获取鼠标在进度条的坐标
export const getMouseInBarPx = (pageX: number, bar: number) => {
  return new Promise(resolve => {
    resolve(1);
  })
    .then(() => {
      let barMarginPx: number = (bar / 96) * 2;
      return pageX - barMarginPx;
    })
    .catch(reason => {
      return reason;
    });
};

export const getMousePxInVideoTime = (
  //@ts-ignore
  totalTime: number,
  mouse: number,
  barLong: number
) => {
  return new Promise(reoslve => {
    reoslve(1);
  })
    .then(() => {
      let total = totalTime / 100;
      let m = (mouse / barLong) * 100 * total;
      return m;
    })
    .catch(reason => {
      return reason;
    });
};
