import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './dropdown.scss';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      value: null
    }
    this.dropdownRef = React.createRef();
    this.onInputClicked = this.onInputClicked.bind(this);
    this.onItemClicked = this.onItemClicked.bind(this);
    this.onItemListBlur = this.onItemListBlur.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { state } = this;
    if (!prevState.opened && state.opened) {
      this.dropdownRef.current.focus();
    }
  }

  onInputClicked(e) {
    this.setState({ opened: !this.state.opened });
  }

  onItemClicked(e, item) {
    this.setState({ value: item.id, opened: false }, () => {
      const { onChange } = this.props;
      const { value } = this.state;
      onChange && onChange(value);
    });
  }

  onItemListBlur(e) {
    this.setState({ opened: false });
  }

  getLabel(value) {
    const { items } = this.props;
    const item = items.find(item => item.id === value);
    return item ? item.label : null;
  }
  
  render() {
    const { items, placeholder, label } = this.props;
    const { value } = this.state;

    const dropdownPanelClassNames = classnames({
      ['dropdown-panel-container']: true,
      open: this.state.opened
    });

    return (
      <div tabIndex="1" ref={this.dropdownRef} onBlur={this.onItemListBlur} className="dropdown-container">
        <section className="dropdown-label">{label}</section>
        <section className="dropdown-text-input-container">
        <div
          id="dropdown-text-input"
          onClick={this.onInputClicked}
        >
          {value ? this.getLabel(value) : <span className="dropdown-placeholder-text">{placeholder}</span>}
        </div>
        </section>
        <section className={dropdownPanelClassNames}>        
          <ul className="dropdown-panel-list">
            {items.map(
              item => (
                <li 
                  key={item.id}
                  className="dropdown-panel-item"
                  onMouseDown={(e) => this.onItemClicked(e, item)}
                  tabIndex="1"
                >
                  {item.label}
                </li>
              )
            )}
          </ul>
        </section>
      </div>
    );
  }
}

Dropdown.propTypes = {
  label: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  placeholder: PropTypes.string
}

export default Dropdown;