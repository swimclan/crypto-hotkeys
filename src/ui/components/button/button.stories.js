import React from 'react';
import Button from './';

export default { title: 'Button' };

export const enabled = () => (
  <Button disabled={false} label="Buy" onClick={console.log} hexColor="#090" />
);

export const disabled = () => (
  <Button disabled={true} label="Sell" onClick={console.log} hexColor="#900" />
);