import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './card.scss';

function Card(props) {
  return (
    <div data-label={props.label} className="card-container">
      {props.children}
    </div>
  );
}

Card.propTypes = {
  label: PropTypes.string,
  children: PropTypes.object
}

export default Card;