const helper = require('./lib/helper');

module.exports = function (options) {
    this.add('role:invoice,cmd:createInvoice', function (msg, respond) {
        console.log("======Invoice Service============================");
        console.log(msg);
        var invoice_data = msg.invData;
        console.log('----------------po_data', invoice_data._id);
        findInvoiceByIdFunction({ _id: invoice_data._id }).then(
            res => {
                console.log('res from findInvoiceByIdFunction promise', res)
                if (res.create == true) {
                    if (msg.bulk_status == false) {
                        return true;
                    } else {
                        return respond({ msg: "Invoice Exist" })
                    }
                } else {
                    console.log('call update operation');
                }
            }, err => {
                console.error('err from findInvoiceByIdFunction promise', err)
                return respond(err);
            }
        ).then(
            res => {
                if (res) {
                    console.log('create invoice operation start');
                    invoice_data.invoice_status = "Created";
                    invoice_data.created_dt = Date.now();
                    helper.createInvoice(invoice_data).then(
                        res => {
                            console.log('create operation for invoice', res)
                            if (res) {
                                return true;
                            } else {
                                return respond({ msg: "Failed in writting invoice" });
                            }
                        }, err => {
                            console.error(err)
                            return respond(err);
                        }
                    )
                } else {
                    console.log('update operation promise')
                }
            }, err => {
                return respond(err);
            }
        ).then(
            res => {
                console.log('update invoice in PO Doc')
                updateInvoiceIDinPOFunction({ invoice_id: invoice_data._id, po_num: msg.po_num, po_ver: msg.po_ver }).then(
                    res=>{
console.log('res from updateInvoiceIDinPOFunction--------------->', res)
                        if(res.success==true){
                            return true;
                        }else{
                            return respond({msg:"Error in updating invoices array in PO"})
                        }
                    },err=>{
console.error(err);
                    }
                ).then(
                    res=>{
                        console.log('blockchain operation')
                        blockchainTxFunction(invoice_data, msg).then(
                            res=>{
                                console.log('res from blockchainTxFunction', res)
                                if(res.success==true){
                                return respond({msg:res});
                                }else{
                                    return respond({msg:'error in creating tx in blockchain'});
                                    //******************* Rollback option start */
                                }
                            },err=>{
                                console.error('operation failed', err);
                            }
                        )
                    }
                )
            }, err => {
                return respond(err);
            }
        ).catch(err=>{
            console.log('err in chain', err)
        })

    });

    blockchainTxFunction=(invoice_data, msg)=>{
        var blockchainInvokeData = {

            "peers": ["peer0.boeing.offset", "peer1.boeing.offset", "peer1.supplier.offset", "peer0.supplier.offset"],
            "fcn": "createInvoice",
            "args": [invoice_data._id,
            invoice_data.invoice_desc,
            msg.po_num,
            msg.po_ver,
            invoice_data.created_by,
            invoice_data.invoice_dt.toString(),
            invoice_data.invoice_amount.toString(),
            invoice_data.invoice_status,
            invoice_data.credit_claimed.toString(),
                "invoice_data.document_id",
                "invoice_data.submission_package_id",
            invoice_data.created_dt.toString()
            ]
        }
        return new Promise((resolve, reject) => {
            this.act('role:blockchain, cmd:invoke', blockchainInvokeData, function (err, response) {
                if (err) {
                    reject(err)
                }
                console.log('response of------------->>>>>>>>>>>>>>>', response);
                resolve(response);
            })
        })
    }

    updateInvoiceIDinPOFunction=(data)=>{
        return new Promise((resolve, reject) => {
            this.act('role:po, cmd:updateInvoiceIDinPO', data, function (err, response) {
                if (err) {
                    reject(err)
                }
                console.log('response of------------->>>>>>>>>>>>>>>', response);
                resolve(response);
            })
        })
    }

    findInvoiceByIdFunction = (data) => {
        return new Promise((resolve, reject) => {
            this.act('role:invoice,cmd:findInvoiceById', data, function (err, response) {
                if (err) {
                    reject(err)
                }
                console.log('response of------------->>>>>>>>>>>>>>>', response);
                resolve(response);
            })
        })
    }


    //View Microservice for viewById
    this.add('role:invoice,cmd:findInvoiceById', function (msg, respond) {
        console.log('-----------------data reach to view Invoice by ID------', msg);
        var query = { "_id": msg._id };
        helper.findInvoiceById(query).then(
            res => {
                console.log('res of promise', res);
                if (res.length == 0) {
                    return respond(null, {
                        msg: res,
                        create: true
                    })
                } else {
                    return respond(null, {
                        msg: res,
                        create: false
                    })
                }
            }, err => {
                console.log('err in operation', err);
                return respond(err)
            })
    })


    // getInvoiceByPOAndVersion

    this.add('role:invoice, cmd:getInvoiceByPOAndVersion', function (msg, respond) {
        console.log('------------Request Reached to getInvoiceByPOAndVersion ------- ');
        console.log('request data is', msg);
        pofindByIdAndVersionsFunction({ _id: msg.po_num, po_ver: msg.po_ver }).then(
            res => {
                console.log('res from promise pofindByIdAndVersionsFunction ---------------', res);
                let poData = res.msg[0];
                let invoiceData = [];
                poData.versions.forEach((data => {
                    if (data.po_ver == msg.po_ver) {
                        invoiceData = data.invoices
                    } else {
                        console.log('No version found')
                    }
                }))
                return invoiceData;
            }, err => {
                console.log('err in operation', err);
                return respond(err);
            }
        ).then(
            res => {
                console.log('promise return from chain', res)
                if (res.length > 0) {
                    console.log('response length ')
                    var self = this;
                    findInvoicePromise(res, self).then(
                        res => {
                            console.log('------Output of promise--', res)
                            return respond({ res, statusCode: 200 })
                        },
                        err => {
                            return respond(err)
                        }
                    )
                } else {
                    return respond({ success: false, msg: 'No element found' })
                }

            }, err => {
                return respond(err);
            }
        )
    })


    this.add('role:po, cmd:deleteInvoiceByInvoiceId', function (msg, respond) {
        var query = { _id: msg._id };
        helper.deleteInvoiceByInvoiceId(query).then(
            res => {
                console.log('response from promise', res);
                return respond(res)
            }, err => {
                return respond(err)
            }
        )

        // invoiceModel.deleteOne({ _id: msg._id }, function (err) {
        //     if (err) {
        //         return respond({ success: false, error: err })
        //     } else {
        //         return respond({ success: true })
        //     }

        // })
    })


    //--------------------findAllInvoiceById-----------------------
    this.add('role:invoice,cmd:findAllInvoiceById', function (msg, respond) {
        console.log('Msg reached to findAllInvoiceById', msg)
        console.log(msg.data)
        var res = msg.data.map((data) => {
            return data.invoice_id
        })
        var query = { _id: { $in: res } };
        helper.findInvoiceById(query).then(
            res => {
                console.log('res from promise', res);
                return respond(null, res);
            }, err => {
                console.log('err in promise return', err);
                return respond(err)
            }
        )
    })

    findInvoicePromise = (invoiceData, self) => {
        console.log('invoice Data reached to promise', invoiceData)
        return new Promise((resolve, reject) => {
            self.act('role:invoice,cmd:findAllInvoiceById', { data: invoiceData }, function (err, responsefindInvoiceById) {
                if (err) {
                    reject(err)
                }
                console.log('response of------------->>>>>>>>>>>>>>>', responsefindInvoiceById);
                resolve(responsefindInvoiceById);
            })
        })
    }

    pofindByIdAndVersionsFunction = (data) => {
        return new Promise((resolve, reject) => {
            this.act('role:po,cmd:findByIdAndVersions', data, function (err, response) {
                if (err) {
                    reject(err)
                }
                console.log('response of------------->>>>>>>>>>>>>>>', response);
                resolve(response);
            })
        })
    }
}