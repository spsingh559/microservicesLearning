var seneca = require('seneca')();


var poPlugin = require('./poPlugin');
var mwConfig=require('../../config/middlewareConfig');

// console.log( process.env.MONGO_URL || 'mongodb://'+mwConfig.mwUrl+':27017/poDB');
  seneca
  .use(poPlugin
  //   ,{
  //   mongoUrl: process.env.MONGO_URL || 'mongodb://'+mwConfig.mwUrl+':27017/poDB'
  // }
  )
  .use('mesh', { auto:true, pin:'role:po,cmd:*'})


