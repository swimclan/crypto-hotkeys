import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './account-info.scss';

function AccountInfo(props) {
  const { account } = props;
  const currencies = Object.keys(account);
  const processedAccount = currencies.reduce((acc, currency) => {
    if (currency.toLowerCase() === 'usd') {
      acc[currency] = parseFloat(account[currency]).toFixed(2);
    } else {
      acc[currency] = parseFloat(account[currency]).toFixed(4);
    }
    return acc;
  }, {});
  return account ? (
    <div className="account-info-container">
      <ul>
        {
          currencies.map(currency => (
          <li key={currency}>
            <span className="account-info-currency-name">{currency}</span>
            <span>{`: ${currency === 'USD' ? '$' : ''}${processedAccount[currency]}`}</span></li>
          ))
        }
      </ul>
    </div>
  ) : null;
}

AccountInfo.propTypes = {
  account: PropTypes.object
}

export default AccountInfo;