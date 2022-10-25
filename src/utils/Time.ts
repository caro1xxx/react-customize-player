export const formatTime = (time: number) => {
  return Promise.resolve(true)
    .then(() => {
      let h: number | string = parseInt(time / 3600 + '');
      h = h < 10 ? '0' + h : h;
      let m: number | string = parseInt((time % 3600) / 60 + '');
      m = m < 10 ? '0' + m : m;
      let s: number | string = parseInt((time % 60) + '');
      s = s < 10 ? '0' + s : s;
      return h + ':' + m + ':' + s;
    })
    .catch(e => {
      return e;
    });
};

export const gotoPxToTime = (
  width: number,
  gotoPx: number,
  duration: number
) => {
  return Promise.resolve(true)
    .then(() => {
      let res = (width - 40) / 100;
      let durationPrecent = duration / 100;
      let goto = gotoPx / res;
      return goto * durationPrecent;
    })
    .catch(e => {
      return e;
    });
};

export const autoPlayTime = (
  videoForwardpx: number,
  progressWidth: number,
  duration: number,
  currentTime: number,
  width: number
) => {
  return Promise.resolve(true)
    .then(() => {
      if (progressWidth + width / duration > width) {
        return width;
      }
      return progressWidth + width / duration;
      let m = duration - currentTime;
      let w = width - videoForwardpx;
      return progressWidth + w / m;
    })
    .catch(e => {
      return e;
    });
};
