import React from 'react';
import Card from './';
import AccountInfo from '../account-info';
import RangeControl from '../range-control';
import FeeComputer from '../fee-computer';

export default { title: 'Card' };

export const withSingleChild = () => (
  <Card label="Account Information">
    <AccountInfo
      account={{ BTC: 1.435345, USD: 2137.23 }}
    />
  </Card>
);

export const withMultipleChildren = () => (
  <Card label="Account Fraction">
    <RangeControl increments={0.05} onChange={console.log} />
    <FeeComputer fee={1.23} remainder={35.12} total={36.35} />
  </Card>
);
