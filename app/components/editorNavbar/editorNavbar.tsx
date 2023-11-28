import React, { useMemo } from 'react';

import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';

import Tab from '../tab/tab';

const Wrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const RightOfTabs = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 2px 0;
  width: auto;
`;

const TabList = styled.div`
  display: flex;
  width: auto;
  overflow-x: auto;
  flex: 1;
  // max-width: 64%;
`;

const Menu = styled.div`
  padding: 5px 10px;
  border-style: solid;
  border-color: black;
  border-width: 1px;
  border-radius: 2px;
`;

const TabAll_ = ({
  tabs,
  selectedTab,
  currentTab,
  selectTab,
  setIsMute,
  removeTab,
  setLabel,
}) => {
  return (
    <>
      {tabs.map((tab, i) => (
        <Tab
          isBlink={tab.isBlink}
          key={i}
          active={selectedTab === i}
          style={{
            borderBottomColor: selectedTab !== i ? currentTab.color : '',
          }}
          color={tab.color}
          selectTab={() => selectTab(i)}
          setIsMute={() => setIsMute(i)}
          isMuted={tabs[i].isMuted}
          showIcon={true}
          label={tab.name}
          setLabel={(label) => setLabel(i, label)}
          removeTab={() => removeTab(i)}
          last={tabs.length <= 1}
        />
      ))}
    </>
  );
};

const TabAll = React.memo(TabAll_, (cur, next) => {
  return cur.tabs === next.tabs && cur.selectedTab === next.selectedTab;
});

const EditorNavbar = ({
  tabs,
  selectedTab,
  menu,
  selectTab,
  addTab,
  canAddTab,
  setIsMute,
  setLabel,
  removeTab,
}) => {
  const theme = useTheme();
  const currentTab = tabs[selectedTab];

  return (
    <Wrap>
      <TabList>
        <TabAll
          tabs={tabs}
          setIsMute={setIsMute}
          selectedTab={selectedTab}
          selectTab={selectTab}
          removeTab={removeTab}
          setLabel={setLabel}
          currentTab={currentTab}
        />
        {canAddTab && (
          <Tab
            selectTab={() => addTab()}
            color={theme.background.default}
            style={{
              borderBottomColor: currentTab.color,
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Tab>
        )}
      </TabList>
      <RightOfTabs>
        <Menu color={theme.background.default}>{menu}</Menu>
      </RightOfTabs>
    </Wrap>
  );
};

EditorNavbar.defaultProps = {
  addTab: () => {},
  selectTab: () => {},
  menu: '',
};

EditorNavbar.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedTab: PropTypes.number.isRequired,
  menu: PropTypes.node,
  selectTab: PropTypes.func,
  addTab: PropTypes.func,
  canAddTab: PropTypes.bool,
};

export default EditorNavbar;
