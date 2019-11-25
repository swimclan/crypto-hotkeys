const {
  productsController,
  accountInfoController,
  feeComputerController,
  buyController,
  sellController,
  cancelController,
  generateCreateUserAndCredentialController
} = require('../controllers');

module.exports.coinbase = function(router, db) {
  router.get('/products', productsController);
  router.get('/account-info/:product_id', accountInfoController);
  router.get('/fee-computer/type/:type/percent/:percent', feeComputerController);
  router.post('/buy', buyController);
  router.post('/sell', sellController);
  router.delete('/cancel', cancelController);
  return router;
}

module.exports.user = function(router, db) {
  router.post('/create', generateCreateUserAndCredentialController(db));
  router.get('/', (req, res) => {
    res.status(200).send('User retrieved');
  });

  return router;
}