import React from 'react';

import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const Container = styled.div`
  border-style: solid;
  border-width: 2px;
  overflow: hidden;
  display: flex;
  aling-items: center;
  height: 100%;
  width: 100%;
`;

const Navbar = styled.div`
  max-width: calc(100vw - 16px);
  padding: ${({ theme }) => theme.spacing(0, 1)};
  margin-bottom: -2px;
`;

const Template = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing(1.5)};
  display: grid;
  width: 100vw;
  height: 100vh;

  grid-template-area: 'navbar' 'main' 'controls' 'preview';
  grid-template-rows: auto 1fr auto auto;

  ${Container} {
    border-color: ${({ color }) => color};
  }

  ${Container}:nth-of-type(2) {
    border-top-left-radius: ${({ theme }) => theme.radius};
    border-top-right-radius: ${({ theme }) => theme.radius};
    border-bottom: none;
  }

  ${Container}:nth-of-type(3) {
    padding: ${({ theme }) => theme.spacing(1, 0.5)};
  }

  ${Container}:last-of-type {
    border-bottom-left-radius: ${({ theme }) => theme.radius};
    border-bottom-right-radius: ${({ theme }) => theme.radius};
    border-top: none;
  }
`;

const EditorTemplate = ({
  color,
  navbar,
  main,
  controls,
  preview,
  style,
  className,
}) => {
  return (
    <Template color={color} style={style} className={className}>
      <Navbar> {navbar} </Navbar>

      <Container>{main}</Container>
      <Container>{controls}</Container>
      <Container>{preview}</Container>
    </Template>
  );
};

EditorTemplate.propTypes = {
  navbar: PropTypes.element,
  main: PropTypes.element,
  controls: PropTypes.element,
  preview: PropTypes.element,
  style: PropTypes.object,
  className: PropTypes.string,
  color: PropTypes.string,
};

export default EditorTemplate;
