export const formatTime = (time: number) => {
  return Promise.resolve(true).then(() => {
    let h = parseInt(time / 3600 + '');
    let hour = h < 10 ? '0' + h : h;
    let m = parseInt((time % 3600) / 60 + '');
    let mins = m < 10 ? '0' + m : m;
    let s = parseInt((time % 60) + '');
    let second = s < 10 ? '0' + s : s;
    return hour + ':' + mins + ':' + second;
  });
};

export const forwordPxToVideoTime = (
  forwordPx: number,
  duration: number,
  width: number
) => {
  return duration / (width / forwordPx);
};

export const getDetailLeft = (left: number, pageX: number) => {
  return pageX - left - 70;
};
