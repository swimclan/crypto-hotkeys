const Sequelize = require('sequelize');
const Logger = require('./logger');
const logger = Logger({ outputs: ['file', 'console'] });
let instance;

module.exports = function DB() {
  const sequelize = new Sequelize('coinbase_hotkeys', 'admin', '123abc', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
  });

  sequelize.authenticate()
    .then(() => {
      logger.log('info', 'Database successfully connected')
    })
    .catch((err) => {
      logger.log('error', 'Something went wrong during database connection');
    });

    if (!instance) {
      return instance = sequelize;
    } else {
      return instance;
    }
}