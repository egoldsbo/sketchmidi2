import React from 'react';

import Filler from './filler';
import README from './README.md';

export default {
  title: 'Atoms/Filler',
  parameters: {
    jest: ['filler'],
    readme: {
      sidebar: README,
    },
  },
};

export const Normal = () => (
  <Filler style={{ width: '100vw', height: '100vh' }}>Filler</Filler>
);
