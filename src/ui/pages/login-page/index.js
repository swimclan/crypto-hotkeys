import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Login from '../../components/login';
import './login-page.scss';


class LoginPage extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="login-page-container">
        <Login onSubmit={console.log} />
      </div>
    );
  }

}

LoginPage.propTypes = {

};

export default LoginPage;