const winston = require('winston');
const loggerConfig = require('./loggerConfig');
const { NODE_ENV } = require('../config');

winston.addColors(loggerConfig.colors);

const logger = winston.createLogger({
  levels: loggerConfig.levels,
  transports: [
    new winston.transports.File({
      filename: loggerConfig.errorFile,
      level: 'error',
      format: winston.format.combine(
        loggerConfig.timeFormat,
        loggerConfig.messageFormat
      )
    }),
    new winston.transports.Console({
      level: NODE_ENV === 'production' ? 'db' : 'debug',
      format: winston.format.combine(
        winston.format.colorize({all: true }),
        loggerConfig.timeFormat,
        loggerConfig.messageFormat
      )
    })
  ]
});

/*logger.info('An info msg x2');
logger.debug('A debug msg x2');
logger.db('A db log x2');
logger.error('An error msg x2');*/

module.exports = logger;
