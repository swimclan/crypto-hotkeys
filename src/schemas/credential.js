const Sequelize = require('sequelize');

module.exports = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  cb_shared_secret: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cb_key: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cb_passphrase: {
    type: Sequelize.STRING,
    allowNull: false
  }
}