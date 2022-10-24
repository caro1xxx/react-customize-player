import styled from 'styled-components';
export const Wrap = styled.div`
  position: relative;
  background-color: black;
  color: white;
  cursor: default;
`;

export const Video = styled.video``;

export const Control = styled.div`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.542));
  position: absolute;
  bottom: 0px;
  height: 50px;
  left: 0px;
  right: 0px;
  display: flex;
  align-items: center;
  margin: 0 2%;
  animation: show 0.2s linear;

  @keyframes show {
    from {
      height: 0px;
    }
    to {
      height: 50px;
    }
  }
`;

export const Bar = styled.div`
  cursor: pointer;
  position: absolute;
  border-radius: 5px;
`;

export const Timestamp = styled.div`
  margin: 0 10px;
  padding-bottom: 5px;
`;

export const QuickVideo = styled.video`
  position: absolute;
  z-index: 10;
  background-color: #fb729900;
  height: 100px;
  width: 150px;
  top: -100px;
`;

export const Volume = styled.div`
  width: 70px;
  height: 35px;
  background-color: #ffffffdd;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 3px;
  color: black;
  font-size: 18px;
`;

export const VolumeBack = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FullScreen = styled.div`
  position: absolute;
  right: 10px;
  cursor: pointer;
`;

export const VolumeControl = styled.div`
  position: absolute;
  right: 50px;
  cursor: pointer;
`;

export const Multiple = styled.div`
  position: absolute;
  right: 90px;
  cursor: pointer;
  font-size: 20px;
  padding-bottom: 5px;
`;

export const MultiplePopup = styled.div`
  user-select: none;
  position: absolute;
  z-index: 11;
  right: -10px;
  bottom: 45px;
  font-size: 15px;
  border-radius: 2px;
  div {
    background-color: #292929;
    padding: 0 20px;
    text-align: center;
    line-height: 25px;
    :hover {
      background-color: #808080;
    }
  }
`;
