import styled from 'styled-components';

export const Wrap = styled.div`
  position: relative;
  z-index: 1;
  display: inline-block;

  * {
    color: white;
    user-select: none;
  }
`;

export const Video = styled.video`
  position: absolute;
  z-index: 2;
`;

export const Control = styled.div`
  background-image: linear-gradient(#54545417, #54545492);
  position: absolute;
  z-index: 3;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  padding: 0px 20px;
  display: flex;
  align-items: center;
`;

export const StampTime = styled.div`
  margin: 0px 10px;
  margin-bottom: 5px;
`;

export const Bar = styled.div`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 40px;
  height: 2px;
  z-index: 4;
  * {
    cursor: pointer;
    border-radius: 3px;
  }
`;
export const BackBar = styled.div`
  position: absolute;
  width: 100%;
  z-index: 4;
  background-color: #e5e5e5;
`;

export const BufferBar = styled.div`
  position: absolute;
  z-index: 5;
`;

export const ProgressBar = styled.div`
  position: absolute;
  z-index: 6;
`;

export const DetailVideo = styled.video`
  position: absolute;
  z-index: 6;
  bottom: 50px;
  width: 180px;
  height: 100px;
`;

export const Load = styled.div`
  position: absolute;
  z-index: 6;
  top: 0%;
  bottom: 50px;
  left: 0%;
  right: 0%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Loading = styled.div`
  position: relative;
  width: 30px;
  height: 30px;
  border: 2px solid #ededed;
  border-top-color: rgba(186, 186, 186, 0.2);
  border-right-color: rgba(186, 186, 186, 0.2);
  border-bottom-color: rgba(186, 186, 186, 0.2);
  border-radius: 100%;

  animation: circle infinite 0.75s linear;
  @keyframes circle {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const VolumeBack = styled.div`
  position: absolute;
  z-index: 7;
  top: 0%;
  bottom: 50px;
  left: 0%;
  right: 0%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Volume = styled.div`
  background-color: white;
  border-radius: 5px;
  color: black;
  font-size: 20px;
  display: flex;
  align-items: center;
  padding: 5px 5px;
`;

export const ControlVolume = styled.div``;
