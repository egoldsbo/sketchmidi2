import React from 'react';
import Modal from 'react-modal';

import Button from '../button';
import styled from '@emotion/styled';

const CornerButton = styled(Button)`
  position: absolute;
  top: 6px;
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
      className="HelpModal"
      overlayClassName="Overlay"
    >
      <CornerButton onClick={closeModal} inverse>X</CornerButton>
<p  >for guides, updates, and more information</p>
<p  ><a href="http://www.sketchmidi.com" rel="noopener noreferrer" target="_blank">www.sketchmidi.com</a> &nbsp;or check help.txt</p>

<p  >CTRL+C &nbsp; &nbsp; &nbsp; copy current measure</p>
<p  >CTRL+SHIFT+C copy current section</p>
<p  >CTRL+V &nbsp; &nbsp; &nbsp; paste</p>
<p  >DEL &nbsp; &nbsp; &nbsp; &nbsp; clear current measure</p>
<p  >SHIFT+DEL &nbsp; clear current section</p>
<p>SPACE &nbsp; &nbsp; &nbsp; start/stop</p>
<p>number keys mute/unmute tracks</p>
    </Modal>
  );
};

export default QuickModal;
