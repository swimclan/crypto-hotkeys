import React from 'react';
import Card from './';
import AccountInfo from '../account-info';

export default { title: 'Card' };

export const withChild = () => (
  <Card label="Account Information">
    <AccountInfo
      account={{ BTC: 1.435345, USD: 2137.23 }}
    />
  </Card>
);
