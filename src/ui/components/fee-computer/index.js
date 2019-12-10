import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './fee-computer.scss';

function FeeComputer(props) {
  return (
    <div className="fee-computer-container">
      {`$${props.fee} (fee) + $${props.remainder} = $${props.total}`}
    </div>
  );
}

FeeComputer.propTypes = {
  fee: PropTypes.number,
  total: PropTypes.number,
  remainder: PropTypes.number
}

export default FeeComputer;