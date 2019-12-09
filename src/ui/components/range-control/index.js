import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './range-control.scss';

function convertValueToPercentage(value) {
  const percentValue = Math.floor(value * 100);
  return `${percentValue}%`;
}

class RangeControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    }
    this.onClickIncrementButton = this.onClickIncrementButton.bind(this);
  }

  onClickIncrementButton(determinator) {
    const { value } = this.state;
    const { increments, onChange } = this.props;
    const incrementsString = increments.toString();
    const decimalLength = incrementsString.split('.')[1].length;
    const newValue = value + (determinator * increments);
    const fixedValue = +newValue.toFixed(decimalLength);
    if (fixedValue < 0 || fixedValue >= 100) {
      return;
    }
    return this.setState({ value: fixedValue }, () => {
      onChange(fixedValue)
    });
    
  }

  render() {
    const { value } = this.state;
    const percentageValue = convertValueToPercentage(value);

    const progressBarClasses = classnames({
      'range-control-progress-bar': true,
      small: value <= 0.05
    });

    return (
      <div className="range-control-container">
        <section className="range-control-button-section">
          <button
            disabled={value <= 0}
            className="range-control-increment-button"
            onClick={() => this.onClickIncrementButton(-1)}
          >
            -
          </button>
        </section>
        <section className="range-control-progress-section">
          <div className="range-control-progress-bar-container">
            <div
              className={progressBarClasses}
              style={{ width: percentageValue }}
            >
              <span className="range-control-percent-value">{percentageValue}</span>
            </div>
          </div>
        </section>
        <section className="range-control-button-section">
        <button
            disabled={value >= 1}
            className="range-control-increment-button"
            onClick={() => this.onClickIncrementButton(1)}
          >
            +
          </button>
        </section>
      </div>
    );
  }

}

RangeControl.propTypes = {
  increments: PropTypes.number,
  onChange: PropTypes.func
}

export default RangeControl;