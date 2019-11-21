const {
  productsController,
  accountInfoController,
  feeComputerController
} = require('../controllers');

const Logger = require('../services/logger');
const logger = Logger({ outputs: ['file', 'console'] });

function loggerMiddleware(req, res, next) {
  const method = req.method;
  const path = req.url;
  res.on('finish', () => {
    let level;
    if (res.statusCode > 399) {
      level = 'error';
    } else {
      level = 'info';
    }
    logger.log(level, `${method} ${res.statusCode} - '${path}'`);
  });
  next();
}

module.exports.coinbase = function(router) {
  router.use(loggerMiddleware);
  
  router.get('/products', productsController);
  router.get('/account-info/:product_id', accountInfoController);
  router.get('/fee-computer/type/:type/percent/:percent', feeComputerController);

  router.get('/fees', async (req, res) => {
    const fees = await coinbase.getFees();
    res.status(200).json(fees);
  });

  router.post('/buy', async (req, res) => {
    const order = await coinbase.order({...req.body, side: 'buy'});
    res.status(200).json(order);
  });

  router.post('/sell', async (req, res) => {
    const order = await coinbase.order({...req.body, side: 'sell'});
    res.status(200).json(order);
  });

  router.delete('/cancel', async (req, res) => {
    const order = await coinbase.cancel();
    res.status(200).json(order);
  });

  return router;
}

module.exports.user = function(router) {
  router.use(loggerMiddleware);
  
  router.get('/', (req, res) => {
    res.status(200).send('User retrieved');
  });

  return router;
}