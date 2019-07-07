
var Seneca=require("seneca");
Seneca({ log: 'silent'})
  .use('mesh', {
    monitor: true
  })