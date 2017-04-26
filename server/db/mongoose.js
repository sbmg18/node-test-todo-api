var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const MONGOLAB_URI = process.env.MONGOLAB_URI;

mongoose.connect(MONGOLAB_URI);

module.exports = {mongoose};