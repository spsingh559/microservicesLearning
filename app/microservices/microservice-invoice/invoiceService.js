var seneca = require('seneca')();


var invoicePlugin = require('./invoicePlugin');
// var mwConfig=require('../../config/middlewareConfig');

// console.log( process.env.MONGO_URL || 'mongodb://'+mwConfig.mwUrl+':27017/poDB');
  seneca
  .use(invoicePlugin
  //   ,{
  //   mongoUrl: process.env.MONGO_URL || 'mongodb://'+mwConfig.mwUrl+':27017/poDB'
  // }
  )
  .use('mesh', { auto:true, pin:'role:invoice,cmd:*'})