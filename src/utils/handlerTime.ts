export const formatTime = (time: number): string => {
  let second: string, minutes: string;
  minutes =
    Number.parseInt(time + '') > 59
      ? Number.parseInt(time + '') / 60 > 10
        ? Number.parseInt(time + '') / 60 + ''
        : '0' + Number.parseInt(time + '') / 60
      : '00';
  second =
    Number.parseInt(time + '') > 9
      ? Number.parseInt(time + '') + ''
      : '0' + Number.parseInt(time + '') + '';
  return minutes + ':' + second;
};
