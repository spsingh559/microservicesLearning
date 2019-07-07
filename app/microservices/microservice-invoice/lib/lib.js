var lib={}
var invoiceModel=require('../invoiceSchema');

lib.findHelper=(query)=>{
console.log('query --------------', query)
    var promise= new Promise((resolve, reject)=>{
        invoiceModel.find(query,function(err, doc){
            if (err) {
                reject(err);
            } else {
               resolve(doc);
            }
        })
    })
    return promise;
}

lib.deleteInvoiceByInvoiceId=(query)=>{
    console.log('query --------------', query)
        var promise= new Promise((resolve, reject)=>{
            invoiceModel.deleteOne(query, function (err) {
                if (err) {
                   reject({ success: false })
                } else {
                    resolve({ success: true })
                }
            })
        })
        return promise;
    }

    lib.createHelper=(invoiceData)=>{
        var promise = new Promise((resolve, reject) => {
            invoiceModel.create(invoiceData, function (err, doc) {
                if (err) {
                    console.error('err in operation', err);
                    reject(false)
                } else {
                    console.log('result is', doc)
                    resolve(true)
                }
            })
    
        })
        return promise;
    }

module.exports=lib;