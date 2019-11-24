const Sequelize = require('sequelize');
const Logger = require('./logger');
const UserSchema = require('../schemas/user');
const CredentialSchema = require('../schemas/credential');
const logger = Logger({ outputs: ['file', 'console'] });

let instance;

module.exports = async function DB() {
  const sequelize = new Sequelize('coinbase_hotkeys', 'admin', '123abc', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
  });

  /**
   * Define all the models
   */
  const User = sequelize.define('user', UserSchema);
  const Credential = sequelize.define('credential', CredentialSchema);
  Credential.hasMany(User);

  async function syncModels(models) {
    for (model of models) {
      try {
        await model.sync({ force: true });
      } catch (err) {
        logger.log('error', typeof err === 'string' ? err : err.message);
      }
    }
  }

  /**
   * Connect to DB
   */
  try {
    await sequelize.authenticate();
    logger.log('info', 'Database successfully connected');
  } catch (err) {
    logger.log('error', typeof err === 'string' ? err : err.message);
  }


  /**
   * Sync all models to tables
   */
  try {
    // await syncModels([ Credential, User, UserCredential ]);
    await syncModels([ User, Credential ]);
    logger.log('info', 'Successfully sync\'d all DB models');
  } catch (err) {
    logger.log('error', typeof err === 'string' ? err : err.message);
  }

  return !instance ? (instance = {
    /**
     * Retrieve model by name
     * @param {string} modelName - The name of the model
     */
    getModel(modelName) {
      const targetModel = modelName.toUpperCase();
      switch(targetModel) {
        case 'USER':
          return User;
        case 'CREDENTIAL':
          return Credential;
      }
    }
  }) : instance;
}