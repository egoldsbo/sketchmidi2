import React, { useMemo } from 'react';

import { Global, css, ThemeProvider } from '@emotion/react';
import PropTypes from 'prop-types';

import createTheme from '../utils/createTheme';
import 'fontsource-nunito';

const spacing = (factor) => factor * 8;
const radius = '8px';

const light = {
  name: 'light',
  background: {
    default: '#000000',
    inverse: '#ffffff',
    pointer: '#00904f',
    actived: '#1adc9d',
    disabled: '#404040',
  },
  colors: {
    primary: '#ffffff',
    secondary: '#c3c3c3',
    inverse: '#000000',
  },
  spacing,
  radius,
};

const dark = {
  name: 'dark',
  background: {
    default: '#ffffff',
    inverse: '#000000',
    pointer: '#0dc3a2',
    actived: '#1adc9d',
    disabled: '#404040',
  },
  colors: {
    primary: '#000000',
    secondary: '',
    inverse: '#ffffff',
  },
  spacing,
  radius,
};

const Theme = ({ children, theme }) => {
  const memoizedTheme = useMemo(
    () => createTheme(theme === 'light' ? light : dark),
    [theme]
  );

  return (
    <>
      <Global
        styles={css`
          html,
          body,
          button,
          select,
          option {
            font-family: nunito;
          }
        `}
      />
      <ThemeProvider theme={memoizedTheme}>{children}</ThemeProvider>
    </>
  );
};

Theme.defaultProps = {
  theme: 'dark',
};

Theme.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.string,
};

export default Theme;
