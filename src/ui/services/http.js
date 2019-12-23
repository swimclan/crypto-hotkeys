import axios from 'axios';

export const fetchProducts = () => {
  const url = '/api/coinbase/products';
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

export const fetchAccountInfo = (productId) => {
  const url = `/api/coinbase/account-info/${productId}`;
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

export const fetchFeeComputer = (percent) => {
  const adjustedPercentValue = +percent * 100;
  const url = `/api/coinbase/fee-computer/type/limit/percent/${adjustedPercentValue}`;
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}