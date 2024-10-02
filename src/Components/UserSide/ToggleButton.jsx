import React from 'react';
import '../../CSS/UserCss/ToggleButton.css';

const ToggleButton = ({ onClick }) => {
  return (
    <button className="toggle-button" onClick={onClick}>
      ☰
    </button>
  );
};

export default ToggleButton;
