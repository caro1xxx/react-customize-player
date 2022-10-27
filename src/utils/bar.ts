export const caculationCurrentSecondTopx = (
  duration: number,
  currentTime: number
) => {
  return (100 * currentTime) / duration;
};

export const getForwordPx = (offsetLeft: number, pageX: number) => {
  return pageX - offsetLeft;
};
