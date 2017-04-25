var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const MONGOLAB_URI = process.env.MONGOLAB_URI || "mongodb://localhost:27017/TodoApp";

mongoose.connect(MONGOLAB_URI);

module.exports = {mongoose};