
var invokePlugin = require('./invokeTransactionPlugin');
var seneca=require('seneca')();
  seneca
  .use(invokePlugin)
  .use('mesh', { auto:true, pin:'role:blockchain,cmd:*'})
