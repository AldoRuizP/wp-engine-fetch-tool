const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error || !result.parsed) {
  throw result.error;
}

module.exports = result.parsed;
