var mongoose = require('mongoose');
var mwConfig=require('../../config/middlewareConfig');
// mongoose.connect('mongodb://'+mwConfig.mwUrl+':27017/poDB');
mongoose.connect('mongodb://'+mwConfig.mwUrl+':27017/poDB', {useNewUrlParser: true}, function(error){
    if(error){
        console.log('Connection issue with mongodb')
    }else{
        console.log(" ==============================Mongo is connected ============================")
    }
});

var Schema = mongoose.Schema;
var poSchema = new Schema({
    _id:{type:String},
    sams_id:{type:String},
    versions:[
        {
            po_ver:{type:String},
            po_desc:{type:String},       
            start_dt:{type:Number},
            end_dt:{type:Number},
            po_status:{type:String},        
            program_id:{type:String},
            supplier_id:{type:String},
            origin_dept_id:{type:String},
            current_dept_id:{type:String},
            po_value:{type:Number},
            credit_expected:{type:Number},
            assign_bds:{type:Boolean},
            assign_bds_dt:{type:Number},
            created_by:{type:String},
            update_by:{type:String},
            priority:{type:Boolean},
            po_assignment_dt:{type:Date},
            created_dt:{type:Number},
            document_id:{type:String},
            updated_dt:{type:Number},
            bulk_status:{type:Boolean},
            invoices:[
                {
                    invoice_id:{type:String}
                }
            ]
        }
    ]  
});
module.exports = mongoose.model('purchaseOrders', poSchema);
