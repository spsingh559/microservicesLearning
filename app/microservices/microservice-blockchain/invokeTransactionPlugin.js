
module.exports = function(options){
var mwConfig=require('../../config/middlewareConfig');
var bcConfig=require('../../config/blockchainConfig');

    var Axios =require('axios');
    // var proxy= {
    //     host: mwConfig.proxy,
    //     port:  mwConfig.host
    // }
    var url =bcConfig.bcUrl+':'+bcConfig.bcPort+'/channels/offsetchannel/chaincodes/offset_cc_mvp'
   
//     console.log('--------Config----,', bcConfig, mwConfig,proxy,url);     
     this.add('role:blockchain,cmd:invoke', function(msg, respond) {
    console.log('----------------------Blockchain Invoke Microservice');
    console.log('-------------------data sent from other microservice--------------', msg);
    
    
    var token= bcConfig.token;
   
//     console.log('------------------blockchainInvokeData----------------', msg);
    
    Axios({
                     method:'post',
                     url:url,
                     headers: {
              'Authorization': 'Bearer '+ token,
              'Content-Type': 'application/json'
    },
                     data:msg
                  
             })
    .then((response) => {
    console.log(response.data)
            if(response.data.success==true){
             return respond(null,{success:true});
            }else{
                    console.log('------------------unsuccessful attempt to write tx ---------------------');
                    return respond(null, {success:false});
            }
    }).catch((error) => {
      console.log(error)
    });
    
    
    //      return respond(null,{success=true});
    
     })
    
    
    
    
    }
    