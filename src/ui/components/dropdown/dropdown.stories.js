import React from 'react';
import Dropdown from './';

export default { title: 'Dropdown' };

export const withItems = () => (
  <Dropdown
    placeholder="Choose a product"
    items={[
      {id: 'BTC-USD', label: 'BTC-USD'},
      {id: 'ETH-USD', label: 'ETH-USD'},
      {id: 'LTC-USD', label: 'LTC-USD'},
      {id: 'BCH-USD', label: 'BCH-USD'}
    ]}
    onChange={console.log}
  />
);