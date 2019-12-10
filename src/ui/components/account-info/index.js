import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './account-info.scss';

function AccountInfo(props) {
  const { account } = props;
  const currencies = Object.keys(account);
  return (
    <div className="account-info-container">
      <ul>
        {
          currencies.map(currency => (
          <li key={currency}>
            <span className="account-info-currency-name">{currency}</span>
            <span>{`: ${currency === 'USD' ? '$' : ''}${account[currency]}`}</span></li>
          ))
        }
      </ul>
    </div>
  );
}

AccountInfo.propTypes = {
  account: PropTypes.object
}

export default AccountInfo;