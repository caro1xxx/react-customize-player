export const syncProgress = (
  currentTime: number,
  offsetWidth: number,
  duration: number
) => {
  let videoLong = offsetWidth / 100;
  let progressBarLong = videoLong * 96;
  let progressBar = progressBarLong / 100;
  let x = (currentTime / duration) * 100;
  return progressBar * x + 'px';
};

export const mouseInBar = (pageX: number, barLong: number, barLeft: number) => {
  let barToLeftPx = (barLong / 100) * 2 + barLeft;
  let px = pageX - barToLeftPx;
  return px;
};

export const barRelatedTime = (
  pageX: number,
  barLong: number,
  barLeft: number,
  //@ts-ignore
  totalTime: number
) => {
  let barToLeftPx = (barLong / 100) * 2 + barLeft;
  let mousePx = pageX - barToLeftPx;
  let barRealLong = (barLong / 100) * 96;
  let res = (mousePx / barRealLong) * 100;
  return (totalTime / 100) * res;
};
