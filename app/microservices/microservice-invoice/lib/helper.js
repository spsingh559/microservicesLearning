var controller = {};
var lib = require('./lib');

//----------------findInvoiceById -------------------
controller.findInvoiceById = (query) => {
    var promise = new Promise((resolve, reject) => {
        lib.findHelper(query).then(
            res => resolve(res),
            err => reject(err)
        )
    })
    return promise;
}

controller.deleteInvoiceByInvoiceId=(query)=>{
    var promise = new Promise((resolve, reject) => {
        lib.deleteOneHelper(query).then(
            res => resolve(res),
            err => reject(err)
        )
    })
    return promise;
}

controller.createInvoice=(data)=>{
    console.log('data in createInvoice', data);
    var promise = new Promise((resolve, reject) => {
        lib.createHelper(data).then(
            res => resolve(res),
            err => reject(err)
        )
    })
    return promise;
}

//----------------

module.exports = controller;