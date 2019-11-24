const _get = require('lodash/get');
const Logger = require('../services/logger');
const Coinbase = require('../services/coinbase');

const logger = Logger({ outputs: ['file', 'console'] });
const coinbase = Coinbase({
  key: process.env.CB_KEY,
  secret: process.env.CB_SECRET,
  passphrase: process.env.CB_PASSPHRASE });

const helpers = {
  isValidProductId(product_id) {
    return product_id.match(/^[A-Z]{3}\-USD$/) != null;
  },
  findAccount(accounts, targetCurrency) {
    return accounts
    .find(({ currency }) => currency === targetCurrency);
  }
}

module.exports = {
  async productsController(req, res) {
    const products = await coinbase.getProducts();
    res.status(200).json(
      products
        .filter(product => helpers.isValidProductId(product.id)));
  },

  async accountInfoController(req, res) {
    const product_id = req.params.product_id;
    if (!helpers.isValidProductId(req.params.product_id)) {
      logger.log('error', 'accountinfoController() - Invalid product id');
      return res
        .status(400)
        .json({
          error: 'Must use product id with USD in the currency pair'
        });
    }
    const currencyPair = product_id.split('-');
    const cryptoCurrency = currencyPair[0];
    let accounts;
    try {
      accounts = await coinbase.getAccounts();  
    } catch (err) {
      logger.log('error', 'Something went wrong with account retrieval');
      return res.status(500).json({ error: 'Something went wrong with account retrieval' });
    }
    const cryptoAccount = 
      helpers.findAccount(accounts, cryptoCurrency)

    const usdAccount = 
      helpers.findAccount(accounts, 'USD');

    return res.status(200).json({
      [cryptoCurrency]: cryptoAccount.available,
      USD: usdAccount.available
    });
  },

  async feeComputerController(req, res) {
    const percent = +req.params.percent;
    const type = req.params.type;
    if (type !== 'limit' && type !== 'market') {
      logger.log('error', 'feeComputerController() - type has to be limit or market');
      return res.status(400).json({ error: 'feeComputerController() - type has to be limit or market'});
    }
    if (isNaN(percent)) {
      logger.log('error', 'feeComputerController() - Invalid percent param');
      return res
        .status(400)
        .json({ error: 'feeComputerController() - Invalid percent param' })
    }
    if (percent > 100 || percent < 10) {
      logger.log('error', 'feeComputerController() - Percent value must be between 10 and 100');
      return res.status(400).json({ error: 'feeComputerController() - Percent value must be between 10 and 100' });
    }
    let accounts;
    try {
      accounts = await coinbase.getAccounts();
    } catch (err) {
      logger.log('error', 'feeComputerController() - Something went wrong with account fetch');
      res
        .status(500)
        .json({ error: 'feeComputerController() - Something went wrong with account fetch' });
    }
  
    const usdAccount = helpers.findAccount(accounts, 'USD');
    const availableUSD = usdAccount.available;

    let fees;
    try {
      fees = await coinbase.getFees();
    } catch (err) {
      logger.log('error', 'feeComputerController() - Something went wrong with fees fetch');
      return res.status(500).json({ error: 'feeComputerController() - Something went wrong with fees fetch' });
    }

    const availableUSDFraction = availableUSD * (percent / 100);
    const feeMultiplier =
      type === 'market' ?
        _get(fees, 'taker_fee_rate', null) :
        _get(fees, 'maker_fee_rate', null);

    const fee = availableUSDFraction * +feeMultiplier;
    const availableUSDRemainder = availableUSDFraction - fee;

    res.status(200).json(
      {
        fee,
        usd: availableUSDFraction,
        remainder: availableUSDRemainder
      });
  },

  async buyController(req, res) {
    let order;
    try {
      order = await coinbase.order({...req.body, side: 'buy'});
    } catch (err) {
      logger.log('error', 'buyController() - Something went wrong with the buy execution');
      res
        .status(500)
        .json({ error: 'buyController() - Something went wrong with the buy execution' });
    }
    res.status(200).json(order);
  },

  async sellController(req, res) {
    let order;
    console.log(req.body);
    try {
      order = await coinbase.order({...req.body, side: 'sell'});
    } catch (err) {
      logger.log('error', 'sellController() - Something went wrong during sell execution');
      res
        .status(500)
        .json({ error: 'sellController() - Something went wrong during sell execution' });
    }
    res.status(200).json(order);
  },

  async cancelController(req, res) {
    let orders;
    try { 
      orders = await coinbase.cancel();
    } catch (err) {
      logger.log('error', 'cancelController() - Something went wrong with the cancel');
      res
        .status(500)
        .json({ error: 'cancelController() - Something went wrong with the cancel' });
    }
    res.status(200).json(orders);
  },

  generateCreateUserAndCredentialController(db) {
    const User = db.getModel('user');
    const Credential = db.getModel('credential');
    return async (req, res, next) => {
      const { first_name, last_name, email_address, password, credentialId = null } = req.body;
      let credential, user;
      if (!credentialId) {
        try {
          credential = await Credential.create(req.body.credential);
        } catch (err) {
          logger.log('error', 'generateCreateUserAndCredentialController() - Something went wrong with creating user');
          return res
            .status(500)
            .json({ error: 'generateCreateUserAndCredentialController() - Something went wrong with creating user' })
        }
      }
      try {
        user = await User.create(
          {
            first_name,
            last_name,
            email_address,
            password,
            credentialId: credentialId || credential.id
          });
      } catch (err) {
        logger.log('error', 'generateCreateUserAndCredentialController() - Something went wrong with creating user');
        return res
          .status(500)
          .json({ error: 'generateCreateUserAndCredentialController() - Something went wrong with creating user' })
      }
      const outUser = credential ? { ...user.toJSON(), credential: {...credential.toJSON()} } : user.toJSON();
      return res.status(200).json(outUser);
    }
  }
}
