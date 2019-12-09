import React from 'react';
import AccountInfo from './';

export default { title: 'Account Info' };

export const withCurrencies = () => (
  <AccountInfo
    account={{
      BTC: 0.3000000000133126,
      USD: 730.9008355652129
    }}
  />
);