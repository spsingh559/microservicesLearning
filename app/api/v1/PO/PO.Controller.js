var controller={};
var seneca = require('seneca')();
seneca.use('mesh',{auto:true});
controller.createPO=function(req,res){
console.log('-----------------Calling PO create API---------------');
console.log('data recieved from server is', req.body);
seneca.act('role:po,cmd:createpo',req.body,function(err,response){
    if(err){
      console.log('error in Connecting PO Microservice');
       res.send(err);
    }else{
      console.log("PO Microservice connected");
       console.log(response);
      res.send({msg:response});
    }
 });

}

controller.viewPO=function(req,res){
  console.log('-----------------Calling PO View API---------------');
 
  seneca.act('role:po,cmd:viewpo',function(err,response){
      if(err){
        console.log('error in Connecting View PO Microservice');
        // res.send(err);
      }else{
        console.log("View PO Microservice connected");
         console.log(response);
        res.send({status:200, msg:'View PO is successful', msResp:response});
      }
   });

  }

  controller.viewPOByRequestorAndDateRange = (req,res)=>{
    console.log('-----------------Calling PO View API viewPOByRequestorAndDateRange---------------');
    
    // '/requestorDept/:requestorDept/requestorName:requestorName/dateRange/:dateRange'
    var queryObj={
      requestorDept:req.params.requestorDept,
      // requestorName:req.params.requestorName,
      startRange:req.params.startRange,
      endRange:req.params.endRange
    }

    console.log('=========data reached yto server========',queryObj);
    // 'domain:po, module:view, cmd:viewPOByRequestorAndDateRange'
    seneca.act('role:po, cmd:viewPOByRequestorAndDateRange',queryObj,function(err,response){
      if(err){
        console.log('error in Connecting View PO viewPOByRequestorAndDateRange');
        // res.send(err);
      }else{
        console.log("viewPOByRequestorAndDateRange connected from client");
         console.log(response);
        res.send( {data:response});
      }
   });
  }

  controller.viewAllVersionPoById=function(req,res){

    var queryObj={
      po_num:req.params.poNum,
    }

    console.log('=========data reached to server viewAllVersionPoById========',queryObj);
    // 'domain:po, module:view, cmd:viewPOByRequestorAndDateRange'
    seneca.act('role:po, cmd:viewAllVersionPoById',queryObj,function(err,response){
      if(err){
        console.log('error in Connecting View PO viewAllVersionPoById');
        // res.send(err);
      }else{
        console.log("viewAllVersionPoById connected from client");
         console.log(response);
        res.send( response);
      }
   });

  }

exports = module.exports = controller;
