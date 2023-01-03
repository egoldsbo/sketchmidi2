import React from 'react';

import { addDecorator } from '@storybook/react';
import '../app/app.global.css';

import Theme from '../app/components/theme/theme.tsx';

addDecorator((storyFn) => (
  <Theme theme="dark">{storyFn()}</Theme>
));

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
