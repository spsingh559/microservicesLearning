var lib={}
const poModel = require('../poSchema');

lib.findHelper = (query) => {
    var promise = new Promise((resolve, reject) => {
        poModel.find(query, function (err, doc) {
            if (err) {
                console.error('err in operation', err);
                reject(err)
            } else {
                resolve(doc)
            }
        })

    })
    return promise;
}

lib.findOneHelper = (query) => {
    var promise = new Promise((resolve, reject) => {
        poModel.findOne(query, function (err, doc) {
            if (err) {
                console.error('err in operation', err);
                reject(err)
            } else {
                resolve(doc)
            }
        })

    })
    return promise;
}

lib.deleteOneHelper=(query)=>{
    var promise = new Promise((resolve, reject) => {
        poModel.deleteOne(query, function (err) {
            if (err) {
                console.error('err in operation', err);
                reject(err)
            } else {
                resolve(true)
            }
        })

    })
    return promise;
}

lib.createHelper=(po_data)=>{
    var promise = new Promise((resolve, reject) => {
        poModel.create(po_data, function (err, data) {
            if (err) {
                console.error('err in operation', err);
                reject(err)
            } else {
                resolve(true)
            }
        })

    })
    return promise;
}

lib.updateOneHelper=(res,po_num)=>{
    var promise = new Promise((resolve, reject) => {
        poModel.updateOne({ _id: po_num }, {
                        $set: { versions: res }
                    }, function (err) {
                        if (err) {
                            console.log('PO update for Invoice Failed')
                            reject(err)
                        } else {
                            console.log('PO update for Invoice Success');
                            resolve(true)
                        }
                    })

    })
    return promise;
}

module.exports=lib;