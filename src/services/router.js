const {
  productsController,
  accountInfoController,
  feeComputerController,
  buyController,
  sellController,
  cancelController,
  generateCreateUserAndCredentialController,
  getOrderbook
} = require('../controllers');

module.exports.coinbase = function(router, db) {
  router.get('/products', productsController);
  router.get('/account-info/:product_id', accountInfoController);
  router.get('/fee-computer/type/:type/percent/:percent', feeComputerController);
  router.post('/buy', buyController);
  router.post('/sell', sellController);
  router.delete('/cancel', cancelController);
  router.get('/orderbook/:product', getOrderbook);
  return router;
}

module.exports.user = function(router, db, passport) {
  router.post('/create', generateCreateUserAndCredentialController(db));
  router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json(req.user);
  });
  router.get('/protected', (req, res) => {
    if (!req.user || !req.user.id) {
      return res.status(401).send('Unauthorized');
    }
    res.status(200).send('You can see the secret info!');
  });

  return router;
}

module.exports.page = function(router) {
  router.get('/*', (req, res) => {
    res.status(200).render('index');
  });

  return router;
}