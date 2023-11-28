import styled from '@emotion/styled';

const Filler = styled.div`
  width: ${({ width }) => (width ? width : '100%')};
  height: ${({ height }) => (height ? height : '100%')};
  background-color: ${({ color }) => (color ? color : '#DDDDDD')};
`;

export default Filler;
