export const goToPx = (left: number, pageX: number) => {
  return Promise.resolve(true)
    .then(() => {
      return pageX - left - 20;
    })
    .catch(e => {
      return e;
    });
};
