import React from 'react';
import Modal from 'react-modal';

import Button from '../button';
import styled from '@emotion/styled';

const CornerButton = styled(Button)`
  position: absolute;
  top:   6px;
  right: 6px;
  margin: 0;
  padding: 0.5em;
  line-height: 1;
`;

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

const QuickModal = ({children, isOpen, onAfterOpen, onRequestClose, closeModal, label}) => {
  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}
      contentLabel={label}
      className="Modal"
      overlayClassName="Overlay"
    >
      <CornerButton onClick={closeModal} inverse>X</CornerButton>
      {children}
    </Modal>
  );
};

export default QuickModal;
