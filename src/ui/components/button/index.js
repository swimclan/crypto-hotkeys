import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './button.scss';

function Button(props) {
  const { onClick, disabled, label, hexColor } = props;
  const buttonClassNames = classnames({
    ['button-container']: true,
    disabled
  });
  
  return (
  <button
    className={buttonClassNames}
    onClick={onClick}
    disabled={disabled}
    style={{ backgroundColor: hexColor }}
  >
    {label}
  </button>
  )
}

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  hexColor: PropTypes.string
}

export default Button;