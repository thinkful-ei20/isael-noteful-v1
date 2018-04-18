'use strict';
exports.logger = function(req, res, next){
  const date = new Date();
  console.log(`${date.toLocaleDateString()} ${date.toLocaleTimeString()} ${req.method} ${req.path}`);
  next();
};