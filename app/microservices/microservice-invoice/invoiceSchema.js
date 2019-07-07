
var mongoose = require('mongoose');
var mwConfig=require('../../config/middlewareConfig');
mongoose.connect('mongodb://'+mwConfig.mwUrl+':27017/poDB', {useNewUrlParser: true}, function(error){
    if(error){
        console.log('Connection issue with mongodb')
    }else{
        console.log(" ==============================Mongo is connected ============================")
    }
});
var Schema = mongoose.Schema;

var invoiceSchema = new Schema({
    _id:{type:String},
    invoice_desc:{type:String},
    invoice_amount:{type:Number},
    invoice_dt:{type:Number},
    invoice_status:{type:String},
    credit_claimed:{type:Number},
    document_id:{type:String},
    submission_package_id:{type:String},
    created_by:{type:String},
    created_dt:{type:Number} 

});
module.exports = mongoose.model('invoices', invoiceSchema);
