import React, { useState } from 'react';

import styled from '@emotion/styled';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EditorNavbar from './editorNavbar';

export default {
  component: EditorNavbar,
  title: 'Molecules/EditorNavbar',
};

const tabs = [
  { name: 'index 1', color: '#ffffff' },
  { name: 'index 2', color: '#fd0000' },
];

export const Default = () => {
  const [position, setPosition] = useState(0);

  const selectTab = (i) => {
    setPosition(i);
  };

  return (
    <EditorNavbar
      tabs={tabs}
      selectedTab={position}
      selectTab={selectTab}
      menu={
        <Menu>
          <FontAwesomeIcon icon={faCogs} />
        </Menu>
      }
    />
  );
};

const Menu = styled.div`
  ${({ theme }) =>
    theme
      ? `background: ${theme.background.default}; color: ${theme.colors.primary};`
      : ''}
  width: 100%;
  height: 100%;
`;

export const exampleWithMenu = () => {
  const [position, setPosition] = useState(0);
  const [tabs, setTabs] = useState([
    { name: 'index 1', color: '#ffffff' },
    { name: 'index 2', color: '#fd0000' },
  ]);

  const selectTab = (i) => {
    setPosition(i);
  };

  return (
    <EditorNavbar
      tabs={tabs}
      selectedTab={position}
      selectTab={selectTab}
      addTab={() => {
        let newColor = Math.floor(Math.random() * 255 * 255 * 255);
        setTabs([
          ...tabs,
          {
            name: tabs.length.toString(),
            color: `#${newColor.toString(16).padStart(6, '0')}`,
          },
        ]);
      }}
      menu={
        <Menu>
          <FontAwesomeIcon icon={faCogs} />
        </Menu>
      }
    />
  );
};
