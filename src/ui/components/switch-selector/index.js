import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './switch-selector.scss';

const optionsMap = {
  true: 1,
  false: 0
}

class SwitchSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: false
    }
    this.onClickSwitch = this.onClickSwitch.bind(this);
  }

  onClickSwitch(e) {
    const { onChange, options } = this.props;
    const { value } = this.state;
    this.setState({ value: !value }, () => {
      const { value: newValue } = this.state;
      onChange && onChange(options[optionsMap[newValue]].id);
    })
  }

  render() {
    const { options } = this.props;
    const { value } = this.state;
    const firstVal = options[0];
    const secondVal = options[1];

    const switchWrapperClasses = classnames({
      ['switch-selector-switch-wrapper']: true,
      right: value
    });

    return (
      <div className="switch-selector-container">
        <section className="switch-selector-switch-label">{firstVal.label}</section>
        <section className={switchWrapperClasses} onClick={this.onClickSwitch}>
          <div className="switch-selector-switch"></div>
        </section>
        <section className="switch-selector-switch-label">{secondVal.label}</section>
      </div>
    );
  }
}

SwitchSelector.propTypes = {
  // [{ id: 'market', label: 'Market' }]
  options: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func
};

export default SwitchSelector;