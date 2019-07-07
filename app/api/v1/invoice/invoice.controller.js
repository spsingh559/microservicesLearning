var controller={};
var seneca = require('seneca')();
seneca.use('mesh',{auto:true});



controller.createInvoice=function(req,res){
console.log('------------create Invoice API---------------');

seneca.act('role:invoice,cmd:createInvoice',req.body,function(err,response){
    if(err){
      console.log('error in Connecting Invoice Microservice');
       res.send(err);
    }else{
      console.log("Invoice Microservice connected");
       console.log(response);
      res.send({msg:response});
    }
 });
}

controller.getInvoiceByPOAndVersion = function(req,res){
  console.log('------------Get Invoice API, getInvoiceByPOAndVersion---------------');
  var queryObj={
    po_num:req.params.po_num,
    // requestorName:req.params.requestorName,
    po_ver:req.params.po_ver
  }

  seneca.act('role:invoice,cmd:getInvoiceByPOAndVersion',queryObj,function(err,response){
    if(err){
      console.log('error in Connecting Invoice Microservice for getInvoiceByPOAndVersion');
       res.send(err);
    }else{
      console.log("Invoice Microservice connected getInvoiceByPOAndVersion");
       console.log(response);
       
      res.send({msg:response});
    }
 });

}

//Export API Modules
exports = module.exports = controller;