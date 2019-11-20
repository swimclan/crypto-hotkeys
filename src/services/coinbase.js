const crypto = require('crypto');
const request = require('request');
const Logger = require('./logger');
const logger = Logger({ outputs: ['console', 'file'] });

/**
 * A factory to implement all methods of the Coinbase Pro exchange API
 */
module.exports = function Coinbase(options = {}) {
  if (!options.key || !options.passphrase || !options.secret) {
    logger.log('error', 'Coinbase Pro authentication credentials are required!');
    throw new Error('Coinbase Pro authentication credentials are required!');
  }

  // Private properties

  /**
   * The credentials object for Authenticated Client
   * @type {object}
   * @example {key: '9un3f209n', passphrase: 'np0939un3', secret: '9032jf097h3fyf'}
   */
  let credentials = {
    key: options.key,
    secret: options.secret,
    passphrase: options.passphrase
  }

  /**
   * The Coinbase api endpoint
   * @type {string}
   */
  const endpoint = 'https://api.pro.coinbase.com'


  // Private methods

  /**
   * The signing algorithm for authenticated requests (https://docs.pro.coinbase.com/#authentication)
   * @private
   * @param {string} requestPath - The url fragment for the api request
   * @param {object} requestBody - Is the request body parsed as an object
   * @param {string} method - The request method (ie GET, POST, etc)
   * @return {string} - The encoded signed request data
   */
  function signRequest(requestPath, requestBody, method, timestamp) {
    const body = requestBody || '';
    const what = timestamp + method.toUpperCase() + requestPath + body;
    const key = Buffer.from(credentials.secret, 'base64');
    const hmac = crypto.createHmac('sha256', key);
    return hmac.update(what).digest('base64');
  }

  /**
   * A shim of the request library to be used in all API requests
   * @private
   * @param {string[]} urlFragments - A colletion of url fragments for api request URL
   * @param {object} options - A hash of options for the HTTP request
   * @return {Promise<any>} - A resolved promise of the fetched data
   */
  function _request(urlFragments, options = {}) {
    var body;
    try {
      body = JSON.stringify(options.body);
    } catch (_) { body = ''; }
    const method = options.method;
    const requestPath = `/${urlFragments.join('/')}`;
    const timestamp = Date.now() / 1000;
    const signature = signRequest(
      requestPath,
      body,
      method,
      timestamp
    );
    return new Promise((resolve, reject) => {
      const headers = {
        'User-Agent': 'coinbase-pro-hotkeys-server',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'CB-ACCESS-KEY': credentials.key,
        'CB-ACCESS-SIGN': signature,
        'CB-ACCESS-TIMESTAMP': timestamp.toString(),
        'CB-ACCESS-PASSPHRASE': credentials.passphrase
      }
      request({
        method,
        headers,
        body,
        url: endpoint + requestPath
      }, (err, response, data) => {
        if (err) {
          return reject(err);
        }
        let outputData;
        try {
          outputData = JSON.parse(data);
        } catch (err) {
          outputData = null;
          logger.log('error', generateErrorMessage(err));
        }
        return resolve(outputData);
      });
    });
  }

  /**
   * Generate error message string
   * @private
   * @param {object | string} err - The error object or string
   * @return {string} - The Error message
   */
  function generateErrorMessage(err) {
    return typeof err === 'string' ? err : err.message;
  }

  /**
   * Get all products from exchange
   * @return {Promise<object[]>} - The collection of products
   */
  async function getProducts() {
    let products;
    try {
      products = await _request(['products'], { method: 'GET' });
    } catch (err) {
      products = [];
      logger.log('error', generateErrorMessage(err));
    }
    return products;
  }

  /**
   * Get all account info for authenticated user
   * @return {Promise<object[]>} - The collection of account infos
   */
  async function getAccounts() {
    let accounts;
    try {
      accounts = await _request(['accounts'], { method: 'GET' });
    } catch (err) {
      accounts = [];
      logger.log('error', generateErrorMessage(err));
    }
    return accounts;
  }

  /**
   * Get the current fee schedule for the authenticated user
   * @return {Promise<object[]>} - The fee schedule
   */
  async function getFees() {
    let fees;
    try {
      fees = await _request(['fees'], { method: 'GET' });
    } catch (err) {
      fees = [];
      logger.log('error', generateErrorMessage(err));
    }
    return fees;
  }

  /**
   * A simple buy method
   * @param {object} params - The params required to execute a buy order
   * @return {Promise<object>} - The resulting buy order placed on the exchange
   */
  async function buy({ size, price, type = 'limit', product_id } = {}) {
    const side = 'buy';
    const body = {
      type,
      side,
      size,
      product_id
    }
    if (type === 'limit') {
      body.postOnly = true;
      body.price = price;
    }
    let order;
    try {
      order = await _request(['orders'], {
        method: 'POST',
        body
      });
    } catch (err) {
      order = {};
      logger.log('error', generateErrorMessage(err));
    }
    return order;
  }

  /**
   * The sell method
   * @param {object} params - The order parameters for the sell
   * @return {Promise<object>} - The order the just got sold
   */
  async function sell({ size, price, type = 'limit', product_id }) {
    const side = 'sell';
    const body = {
      type,
      size,
      side,
      product_id
    };
    if (type === 'limit') {
      body.postOnly = true;
      body.price = price;
    }
    let order;
    try {
      order = await _request(['orders'], {
        method: 'POST',
        body
      });
    } catch (err) {
      order = {};
      logger.log('error', generateErrorMessage(err));
    }
    return order;
  }

  return {
    getProducts,
    getAccounts,
    getFees,
    buy,
    sell
  }
}