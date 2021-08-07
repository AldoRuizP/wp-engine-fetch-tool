const winston = require('winston');

const config = {
  levels: {
    error: 0,
    warn: 1,
    db: 2,
    info: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    db: 'magenta',
    info: 'cyan',
    debug: 'green'
  },
  timeFormat: winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  messageFormat: winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
  }),
  errorFile: './logs/error.log'
};

module.exports = config;
