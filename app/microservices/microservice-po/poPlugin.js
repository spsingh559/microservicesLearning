// var mongoose = require('mongoose');
// const poModel = require('./poSchema');
const helper = require('./lib/helper');
module.exports = function (options) {

//------------------->createpo microservice<----------------------
this.add('role:po,cmd:createpo', function (msg, respond) {
        console.log("======PO Service============================");
        var po_data = msg.poData;
        var self = this;
        
        findByIdAndVersionsFunction(po_data._id,po_data.versions[0].po_ver, self).then(
            res => {
                console.log('findres', res)
                if (res.isCreate == true) {
                    console.log('create operation');
                    po_data.versions[0].po_status = "Created";
                    po_data.versions[0].created_dt = Date.now();
                    po_data.versions[0].invoices = [];
                    console.log('------------po_data for create operation', po_data);

                    helper.createPO(po_data).then(
                        res => {
                            console.log('res from create operation****************', res);
                            blockchainFunction(po_data, self).then(
                                res => {
                                    console.log('blockchainFunction result----------------', res)
                                    // return respond(null, "success");
                                    if (res.success == false) {
                                        poDeleteFunction(po_data._id, self).then(
                                            res => {
                                                console.log('delete operation successful', res)
                                                return respond(null, res);
                                            },err => {
                                                console.log('delete operation failed', err)
                                                return respond(err);
                                            })
                                    } else {
                                        return respond(null, res);
                                    }
                                },err => {
                                    return respond(err);
                                    console.log(err)
                                })

                        },err => {
                            return respond(err);
                        })
                } else  {
                    if (msg.bulk_status == true) {
                        console.log('update operation')
                    } else {
                        console.log('return PO already exist');
                        return respond(null, {
                            msg: "PO Already Exist"
                        });
                    }
                }
            },err => {
                console.log('err in operation', err)
            }
        ).catch(err => {
            console.log('catch operation ', err)
            return respond(err);
        })
    });

this.add('role:po,cmd:viewpo', function (msg, respond) {
        console.log("======PO Service============================");
        console.log(msg);
        return respond(null, {
            msg: "View PO MS is called"
        });

    });

    // ------------------------------findByIdAndVersions microservice<--------------
this.add('role:po,cmd:findByIdAndVersions', function (msg, respond) {

        console.log('-----------------data reach to findByIdAndVersions------', msg);
        var query = {
            "_id": msg._id,
            "versions.po_ver": msg.po_ver
        }
        helper.findByIdAndVersions(query).then(
            res => {
                console.log('res from promise is', res);
                if (res.length == 0) {
                    return respond(null, {
                        msg: res,
                        isCreate: true
                    })
                } else {
                    return respond(null, {
                        msg: res,
                        isCreate: false
                    })
                }
            },err => {
                return respond(err)
            })
    })

    //------------------------->viewPOByAgentAndDateRange Microservice<-----------------------------
this.add('role:po, cmd:viewPOByRequestorAndDateRange', function (msg, respond) {

        helper.viewPOByRequestorAndDateRange(msg).then(
            res => {
                // console.log('res from promise is', res);
                return respond(null, res);
            },
            err => {
                console.log('err from promise is', err);
                return respond(err);
            }
        )
    })

    //---------------------------deletePOByPOID Microservice <-----------------------------------
this.add('role:po, cmd:deletePOByPOID', function (msg, respond) {
        var query = { _id: msg._id };
        helper.deletePOByPOID(query).then(
            res => { return respond({ success: res }) },
            err => { return respond({ success: false, error: err }) }
        )
    })

    //----------------------------> updateInvoiceIDinPO<-------------------------------
this.add('role:po, cmd:updateInvoiceIDinPO', function (msg, respond) {
        console.log('--------Connected to updateInvoiceIDinPO MS--------', msg);
        var self=this;
findByIdAndVersionsFunction(msg.po_num, msg.po_ver,self).then(
    res=>{
        console.log('response from findByid for update invoice id', res)
        if (res.msg.length > 0) { //PO Exist
            
            helper.prepareDataSetInvoice(res.msg, msg).then(
                res=>{
                    console.log('res from promise',res)
                    helper.updateInvoiceIDinPO(res,msg.po_num).then(
                        res=>{
                            console.log('update done', res);
                            return respond({ success: res })
                        },err=>{
                            console.log('operation failed', err)
                            return respond(err);
                        })
                },err=>{
                    console.log('err from operation');
                    return respond(null, {msg:err});
                })
        }else {
            console.log('----------PO not found---------')
        }
    },err=>{
        console.log('err in operation', err);
        return respond(err);
    }
    )
 })

    // ----------------->>>>>>>>>>>>viewAllVersionPoById <<<<<<<<<<<<<<---------------------

this.add('role:po,cmd:viewAllVersionPoById', function (msg, respond) {
        var query = { _id: msg.po_num };
        helper.viewAllVersionPoById(query).then(
            res => {
                console.log('operation success');
                return respond(null, {
                    res,
                    statusCode: 200
                })
            },
            err => {
                console.log('err in promise for viewAllVersionPoById', err);
                return respond(err);
            }
        )
    })

//-------------------> blockchainFunction <---------------------------------
blockchainFunction = (po_data, self) => {

        var blockchainInvokeData = {
            "peers": ["peer0.boeing.offset", "peer1.boeing.offset", "peer1.supplier.offset", "peer0.supplier.offset"],
            "fcn": "createPO",
            "args": [po_data._id, po_data.versions[0].po_desc, po_data.versions[0].po_ver, po_data.versions[0].po_dt.toString(), po_data.versions[0].po_value.toString(), po_data.versions[0].po_status, po_data.versions[0].credit_expected.toString(), po_data.versions[0].program_id, po_data.versions[0].supplier_id, po_data.versions[0].origin_dept_id, po_data.versions[0].current_dept_id, "DOCUMENT_ID", "ASSIGN_BDS", "ASSIGN_BDS_DATE", po_data.versions[0].created_by, po_data.sams_id]
        }
        let promise = new Promise((resolve, reject) => {
            self.act('role:blockchain, cmd:invoke', blockchainInvokeData, function (err, response) {
                // var myself = self;
                if (err) {
                    console.log('error in connecting blockchain microservice for invoke');
                    reject(err);
                } else {
                    console.log('------------------response by invoke----', response);
                    resolve(response);
                }
            })
        })

        return promise
    }

poDeleteFunction = (po_num, self) => {

        var promise = new Promise((resolve, reject) => {
            self.act('role:po, cmd:deletePOByPOID', { _id: po_num }, function (err, response) {
                if (err) {
                    console.log('error in connecting Delete microservice of deletePOByPOID');
                    reject(err)
                } else {
                    resolve(response)
                }

            })
        })
        return promise;
    }

findByIdAndVersionsFunction = (_id,po_ver, self) => {

        var promise = new Promise((resolve, reject) => {
            self.act('role:po,cmd:findByIdAndVersions', { _id:_id, po_ver: po_ver }, function (err, response) {
                if (err) {
                    console.log('error in connecting view microservice for viewNyId');
                    reject(err);
                } else {
                    console.log('------------------response by viewById----', response);
                    resolve(response);
                }
            });
        })
        return promise;
    }

}