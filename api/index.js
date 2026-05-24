const path = require('path');
process.chdir(path.join(__dirname, '..'));
const app = require('../server.js');
module.exports = app;