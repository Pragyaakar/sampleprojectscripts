/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 */


define(['N/record', 'N/search'], function (record, search) {

    function afterSubmit(context) {
        try {
            var Record1 = context.newRecord;
            var transactionType = Record1.type;

            var recId = context.newRecord.id;
            if (context.type == context.UserEventType.CREATE) {
                if (recId) {
                    var recpayment = record.load({ //load created customerpayment
                        type: transactionType,
                        id: recId
                    });
                    log.debug("recpayment", recpayment)

                    var statuspay = recpayment.getValue({
                        fieldId: 'status'
                    })
                    log.debug('transaction status', statuspay) //customer payment status
                    ////////////////////////////////////////////////////////
                    var lines = recpayment.getLineCount({
                        sublistId: 'apply'
                    })

                    for (var k = 0; k < lines; k++) {
                        var applycheckbox = recpayment.getSublistValue({
                            sublistId: 'apply',
                            line: k,
                            fieldId: 'apply'
                        })
                        log.debug('applycheckbox', applycheckbox)

                        if (applycheckbox) {
                            var invrecid = recpayment.getSublistValue({ //get invoice id from customer payment
                                sublistId: 'apply',
                                fieldId: 'internalid',
                                line: k
                            })
                            log.debug('invrecid ', invrecid)

                            if (invrecid) {
                                var rec = record.load({ //load invoice record from customer payment
                                    type: record.Type.INVOICE,
                                    id: invrecid,
                                    //isDynamic:true
                                });
                                log.debug("invoice rec load", rec)

                                var status = rec.getValue({
                                    fieldId: 'statusRef'
                                })
                                log.debug('invoice status', status) //invoice record status



                                ////////////////////////
                                if (status === 'paidInFull') {

                                    var customername = rec.getValue({ //get entity
                                        fieldId: 'entity'
                                    })
                                    log.debug("customer name", customername)

                                    var subsidiary = rec.getValue({ //get subsidiary
                                        fieldId: 'subsidiary'
                                    })
                                    log.debug("subsidiary", subsidiary)

                                    var invoice_date = rec.getValue({ //get invoice date
                                        fieldId: 'trandate'
                                    })
                                    log.debug("invoice date", invoice_date)

                                    var tranid = rec.getValue({ //get invoice reference id
                                        fieldId: 'tranid'
                                    })
                                    log.debug("invoice reference", tranid)

                                    var linecount = rec.getLineCount({
                                        sublistId: 'item'
                                    });

                                    if (linecount > 0) {
                                        for (var i = 0; i < linecount; i++) {
                                            var item_val = rec.getSublistValue({ //get item
                                                sublistId: 'item',
                                                fieldId: 'item',
                                                line: i
                                            })
                                            log.debug("item_val", item_val)

                                            var qty = rec.getSublistValue({ //get quantity
                                                sublistId: 'item',
                                                fieldId: 'quantity',
                                                line: i
                                            })
                                            log.debug("quantity", qty)

                                            var warrantyterm = rec.getSublistValue({ //get warranty terms 
                                                sublistId: 'item',
                                                fieldId: 'custcol_warrantyterms',
                                                line: i
                                            })
                                            log.debug("warranty terms", warrantyterm)

                                            var w_startdate = rec.getSublistValue({ //get warranty start date
                                                sublistId: 'item',
                                                fieldId: 'custcol_warrantystartdate',
                                                line: i
                                            })
                                            log.debug("warranty start date", w_startdate)

                                            var w_enddate = rec.getSublistValue({ //get warranty end date
                                                sublistId: 'item',
                                                fieldId: 'custcol_warrantyenddate',
                                                line: i
                                            })
                                            log.debug("warranty end date", w_enddate)

                                            var w_track = rec.getSublistValue({ //get track warranty
                                                sublistId: 'item',
                                                fieldId: 'custcol_trackwarranty',
                                                line: i
                                            })
                                            log.debug("track warranty", w_track)


                                            var loc = rec.getSublistValue({ //get location
                                                sublistId: 'item',
                                                fieldId: 'location',
                                                line: i
                                            })
                                            log.debug("location", loc)

                                            var cls = rec.getSublistValue({ //get class
                                                sublistId: 'item',
                                                fieldId: 'class',
                                                line: i
                                            })
                                            log.debug("class", cls)

                                            var dept = rec.getSublistValue({ //get department
                                                sublistId: 'item',
                                                fieldId: 'department',
                                                line: i
                                            })
                                            log.debug("department", dept)

                                            var subrec = rec.getSublistSubrecord({
                                                sublistId: 'item',
                                                line: i,
                                                fieldId: 'inventorydetail'
                                            });
                                            log.debug("inventory detail", subrec)

                                            var subrecline = subrec.getLineCount({
                                                sublistId: 'inventoryassignment'
                                            })

                                            for (var j = 0; j < subrecline; j++) {
                                                var serialno = subrec.getSublistValue({ //get serial/lot no
                                                    sublistId: 'inventoryassignment',
                                                    fieldId: 'issueinventorynumber',
                                                    line: j
                                                })
                                                log.debug("serial/lot no", serialno)

                                                if (serialno && w_track) {
                                                    var recObj = record.create({
                                                        type: 'customrecord_warrantyregistration', //id of custom warranty registration recordtype
                                                        isDynamic: true
                                                    });

                                                    recObj.setValue({ //set name
                                                        fieldId: 'custrecord_customer',
                                                        value: customername
                                                    })

                                                    recObj.setValue({ //set class
                                                        fieldId: 'custrecord_class',
                                                        value: cls
                                                    })

                                                    recObj.setValue({ //set department
                                                        fieldId: 'custrecord_department',
                                                        value: dept
                                                    })

                                                    recObj.setValue({ //set location
                                                        fieldId: 'custrecord_location',
                                                        value: loc
                                                    })

                                                    recObj.setValue({ //set subsidiary
                                                        fieldId: 'custrecord_subsidiary',
                                                        value: subsidiary
                                                    })

                                                    recObj.setValue({ //set reference invoice
                                                        fieldId: 'custrecord_refinvoice',
                                                        value: tranid
                                                    })

                                                    recObj.setValue({ //set item
                                                        fieldId: 'custrecord_itemselect',
                                                        value: item_val
                                                    })

                                                    recObj.setValue({ //set warranty terms
                                                        fieldId: 'custrecord_originalwarrantyterms',
                                                        value: warrantyterm
                                                    })

                                                    recObj.setValue({ //set warranty start date
                                                        fieldId: 'custrecord_originalwarrantystartdate',
                                                        value: w_startdate
                                                    })

                                                    recObj.setValue({ //set quantity
                                                        fieldId: 'custrecord_quantityno',
                                                        value: qty
                                                    })

                                                    recObj.setValue({ //set warranty end date
                                                        fieldId: 'custrecord_warrantyexpirationdate',
                                                        value: w_enddate
                                                    })

                                                    recObj.setValue({ //set invoice date
                                                        fieldId: 'custrecord_invoicedate',
                                                        value: invoice_date
                                                    })

                                                    recObj.setValue({ //set serial/lot no
                                                        fieldId: 'custrecord_refseriallot',
                                                        value: serialno
                                                    })

                                                    var saveid = recObj.save({
                                                        enableSourcing: false
                                                    });
                                                    log.debug('SAVED', saveid)

                                                    if (saveid) {
                                                        var lookID = search.lookupFields({
                                                            type: 'customrecord_warrantyregistration',
                                                            id: saveid,
                                                            columns: ['name']
                                                        }).name

                                                        if (lookID) {
                                                            record.submitFields({
                                                                type: 'customrecord_warrantyregistration',
                                                                id: saveid,
                                                                values: {
                                                                    'custrecord_warrantyregno': lookID
                                                                }
                                                            })
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            log.audit({
                                title: 'Script Terminating',
                                details: 'This payment record has no invoices.'
                            });
                            return true;
                        }
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////
                }
            }
        } catch (error) {
            log.debug('ERROR', error.message);
        }
    }
    return {
        afterSubmit: afterSubmit
    }
});