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
