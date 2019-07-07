var controller = {}
// const poModel = require('../poSchema');
var lib=require('./lib');

//-------------------->viewAllVersionPoById<--------------------------------
controller.viewAllVersionPoById = (query) => {
    console.log('-----------------data reach to helper viewAllVersionPoById ------', query);
    // var query={_id:msg.po_num};
    var promise = new Promise((resolve, reject) => {
        lib.findOneHelper(query).then(
            res=>resolve(res),
            err=>reject(err)
        )
    })
    return promise;
}

//-------------------------->deletePOByPOID <--------------------------
controller.deletePOByPOID = (query) => {
    console.log('----------------helper deletePOByPOID ----------', query);
    // var query={_id:msg.po_num};
    var promise = new Promise((resolve, reject) => {
        lib.deleteOneHelper(query).then(
            res=>resolve(res),
            err=>reject(err)
        )
    })
    return promise;
}

controller.viewPOByRequestorAndDateRange = (msg) => {
    console.log('------------------helper viewPOByRequestorAndDateRange------------');
    var start = parseInt(msg.startRange);
    var end = parseInt(msg.endRange);
    var query;
    if (msg.requestorDept == "Supplier") {
        query = {
            "versions": { $elemMatch: { supplier_id: msg.requestorDept, po_dt: { $gt: start, $lte: end } } }
        }
    } else {
        query = {
            "versions": { $elemMatch: { current_dept_id: msg.requestorDept, po_dt: { $gt: start, $lte: end } } }
        }
    }
    var promise = new Promise((resolve, reject) => {
        lib.findHelper(query).then(
            res => resolve(res),
            err => reject(err)
        )
    })
    return promise;
}

controller.findByIdAndVersions=(query)=>{
    console.log('------------------helper findByIdAndVersions------------', query);
    var promise = new Promise((resolve, reject) => {
        lib.findHelper(query).then(
            res => resolve(res),
            err => reject(err)
        )
    })
    return promise;
}

controller.createPO=(po_data)=>{
    console.log('------------------helper createPO------------', po_data);
    var promise = new Promise((resolve, reject) => {
        lib.createHelper(po_data).then(
            res => resolve(res),
            err => reject(err)
        )
    })
    return promise;
}

controller.prepareDataSetInvoice=(poData,msg)=>{

    var promise = new Promise((resolve, reject)=>{    
 poData[0].versions.forEach((data) => {
    if (data.po_ver == msg.po_ver) {
        let versionData = data;
        //Data added into invoice array
        versionData.invoices.push({ invoice_id: msg.invoice_id });
        console.log('data added into Invoice array', versionData)
resolve(versionData)    
    }else{
        reject('no update')
    }
})
})
return promise;
}

controller.updateInvoiceIDinPO=(res, po_num)=>{
    var promise = new Promise((resolve, reject)=>{
lib.updateOneHelper(res,po_num).then(
    res=>resolve(res),
    err=>reject(err)
)
    })

    return promise;
}

module.exports = controller;