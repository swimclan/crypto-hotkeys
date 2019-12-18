import React from 'react';
import Login from './';

export default { title: 'Login' };

export const basic = () => (
  <Login onSubmit={console.log} />
);