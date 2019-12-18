import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '../card';
import './login.scss';

const INITIAL_STATE = {
  emailAddress: null,
  password: null
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.onSubmit = this.onSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(fieldname, value) {
    switch(fieldname) {
      case 'email':
        this.setState({ emailAddress: value });
        break;
      case 'password':
        this.setState({ password: value });
        break;
      default:
        // no op
    }
  }

  onSubmit() {
    const { onSubmit } = this.props;
    onSubmit && onSubmit(this.state);
    this.setState = INITIAL_STATE;
  }

  render() {
    return (
      <Card label="Login">
        <div className="login-comtainer">
          <input
            type="text"
            className="login-input"
            placeholder="Email Address"
            onInput={
              ({ target: { value } }) => (
                this.onInputChange('email', value)
              )
            }
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            onInput={
              ({ target: { value } }) => (
                this.onInputChange('password', value)
              )
            }
          />
          <button
            className="login-submit"
            onClick={this.onSubmit}
          >
            Submit
          </button>
        </div>
      </Card>
    );
  }
}

Login.propTypes = {
  onSubmit: PropTypes.func
}

export default Login;