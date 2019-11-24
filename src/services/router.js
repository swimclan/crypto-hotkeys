const {
  productsController,
  accountInfoController,
  feeComputerController,
  buyController,
  sellController,
  cancelController,
  generateCreateUserAndCredentialController
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

module.exports.coinbase = function(router, db) {
  router.use(loggerMiddleware);
  router.get('/products', productsController);
  router.get('/account-info/:product_id', accountInfoController);
  router.get('/fee-computer/type/:type/percent/:percent', feeComputerController);
  router.post('/buy', buyController);
  router.post('/sell', sellController);
  router.delete('/cancel', cancelController);
  return router;
}

module.exports.user = function(router, db) {
  router.use(loggerMiddleware);
  router.post('/create', generateCreateUserAndCredentialController(db));

  router.get('/', (req, res) => {
    res.status(200).send('User retrieved');
  });

  return router;
}