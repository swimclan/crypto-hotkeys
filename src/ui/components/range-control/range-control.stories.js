import React from 'react';
import RangeControl from './';

export default { title: 'Range Control' };


export const basic = () => (
  <RangeControl
    increments={0.05}
    onChange={console.log}
  />
);

