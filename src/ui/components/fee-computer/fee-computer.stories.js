import React from 'react';
import FeeComputer from './';

export default { title: 'Fee Computer' };

export const basic = () => (
  <FeeComputer fee={1.23} remainder={23.45} total={24.68} />
)