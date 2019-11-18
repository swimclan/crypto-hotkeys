const fs = require('fs');
const path = require('path');

/**
 * A logging service factory for logging to file and/or console
 * @param {object} options - options object
 * @param {string[]} options.outputs - list of configured outputs
 */
module.exports = function Logger(options = {}) {

  // Private properties
  /**
   * Private property for configured outputs
   * @type {string[]}
   * @example ['console', 'file']
   */
  let outputs = options.outputs || ['console'];

  /**
   * Console output is enabled
   * @type {boolean}
   */
  let consoleEnabled = outputs.indexOf('console') !== -1;

  /**
   * File output is enabled
   * @type {boolean}
   */
  let fileEnabled = outputs.indexOf('file') !== -1;

  /**
   * File to log to
   * @type {string}
   * @example 'app.log'
   */
  let file = null;

  // Private methods

  /**
   * Initializer to run all initial logic on factory construction
   * @private
   */
  function initialize() {
    if (fileEnabled) {
      file = path.resolve(__dirname + '/../../logs/app.log');
      send('info', `App log initialized at ${new Date()}`);
    }
  }

  /**
   * Writes to a file
   * @param {string} level 
   * @param {string} message
   * @return {void}
   */
  function writeFile(level, message) {
    fs.writeFileSync(file, `[${level.toUpperCase()}] ${message}\n`, { flag: 'a' })
  }

  /**
   * Private method to send messages to all configured outputs
   * @private
   * @param {string} message - String of the message being sent
   * @return {void}
   */
  function send(level, message) {
    switch(level) {
      case 'info':
        consoleEnabled && console.info(`[INFO] ${message}`);
        fileEnabled && writeFile(level, message);
        break;
      case 'error':
        consoleEnabled && console.error(`[ERROR] ${message}`);
        fileEnabled && writeFile(level, message);
        break;
      default:
        consoleEnabled && console.log(`[INFO] ${message}`);
        fileEnabled && writeFile(level, message);
    }
  }

  // Initialize factory
  initialize();

  return {
    /**
     * A logging method to be used by the logger's consumer
     * @param {string} level - Either 'error' or 'info'
     * @param {string} message - The message to be sent to all outputs
     */
      log(level, message) {
        send(level, message);
      }
  }
}