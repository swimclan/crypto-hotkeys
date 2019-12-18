import React from 'react';
import SwitchSelector from './';

export default { title: 'Switch Selector' }

export const basic = () => (
  <SwitchSelector 
    options={[
      {id: 'market', label: 'Market'},
      {id: 'limit', label: 'Limit'}
    ]}
    onChange={console.log}
  />
);