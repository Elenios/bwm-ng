if (process.env.NODE.env === 'production') {
  module.exports = require('./prod');
} else {
  module.exports = require('./dev');
}