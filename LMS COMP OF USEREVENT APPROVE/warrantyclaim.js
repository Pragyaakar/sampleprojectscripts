/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search"], function (record, search) {
    function afterSubmit(context) {
        try {
            log.debug("start");
            var Record1 = context.newRecord;
            var transactiontype = Record1.type;
            var recId = context.newRecord.id; // custom rec id

            if (context.type == context.UserEventType.CREATE) {
                if (recId) {
                    var customRecord = record.load({
                        type: transactiontype,
                        id: recId,
                    });
                    var action = customRecord.getValue({
                        fieldId: "custrecordwarrantyclaim_action",
                    });
                    log.debug("action", action);

                    var companyname = customRecord.getValue({
                        fieldId: "custrecordwarrantyclaim_company",
                    });
                    log.debug("companyname", companyname);
                    var Status = customRecord.getValue({
                        fieldId: "custrecordwarrantyclaim_status",
                    });
                    log.debug("Status", Status);
                    var item = customRecord.getValue({
                        fieldId: "custrecordwarrantyclaim_item",
                    });
                    log.debug("item", item);

                    var invoiceno = customRecord.getValue({
                        fieldId: "custrecordwarrantyclaim_invoice",
                    });
                    log.debug("invoiceno", invoiceno);

                    if (invoiceno) {
                        var invoicerec = record.load({
                            type: record.Type.INVOICE,
                            id: invoiceno,
                        });
                        var itemline = invoicerec.getLineCount({
                            // total no of item in invoice
                            sublistId: "item",
                        });

                        if (invoicerec) {
                            for (var i = 0; i < itemline; i++) {
                                var item_inv = invoicerec.getSublistValue({
                                    //   item in invoice
                                    sublistId: "item",
                                    fieldId: "item",
                                    line: i,
                                });
                                log.debug("item in invoice", item_inv);

                                if (item == item_inv) {
                                    var amt = invoicerec.getSublistValue({
                                        sublistId: "item",
                                        fieldId: "amount",
                                        line: i,
                                    });

                                    var taxcode = invoicerec.getSublistValue({
                                        sublistId: "item",
                                        fieldId: "taxcode",
                                        line: i,
                                    });

                                    var startdate = invoicerec.getSublistValue({
                                        sublistId: "item",
                                        fieldId: "custcol_warrantystartdate",
                                        line: i,
                                    });

                                    var enddate = invoicerec.getSublistValue({
                                        sublistId: "item",
                                        fieldId: "custcol_warrantyenddate",
                                        line: i,
                                    });
                                    var subrec = invoicerec.getSublistSubrecord({
                                        sublistId: "item",
                                        line: i,
                                        fieldId: "inventorydetail",
                                    });
                                    log.debug("inventory detail", subrec);

                                    var subrecline = subrec.getLineCount({
                                        sublistId: "inventoryassignment",
                                    });

                                    for (var j = 0; j < subrecline; j++) {
                                        var serialno = subrec.getSublistValue({ //get serial/lot no
                                            sublistId: "inventoryassignment",
                                            fieldId: "issueinventorynumber",
                                            line: j,
                                        });
                                        log.debug("serial/lot no", serialno);
                                    }
                                }
                            }
                        }
                    }
                    // -------------------to set warranty start date ,end date &serial no field---------//

                    var startdate_wc = customRecord.setValue({
                        fieldId: "custrecordwarrantyclaim_start_date", //custrecordwarrantyclaim_start_date
                        value: startdate,
                    });
                    log.debug("warranty startdate", startdate_wc);

                    var endtdate_wc = customRecord.setValue({
                        fieldId: "custrecordwarrantyclaim_expiration_date", //custrecordwarrantyclaim_expiration_date
                        value: enddate,
                    });
                    log.debug("warranty enddate", endtdate_wc);

                    var serialno_wc = customRecord.setValue({ //custrecordwarrantyclaim_serial_lot_wi
                        fieldId: "custrecordwarrantyclaim_serial_lot_wi",
                        value: serialno,
                    });
                    log.debug("serial no", serialno_wc);

                    //



                    if (action == "1") {
                        var WarrantytoReturnAuthRecord = record.create({
                            type: "returnauthorization",
                            isDynamic: true,
                        });
                        log.debug("WarrantytoAuthRecod", WarrantytoReturnAuthRecord);
                        var company_RA = WarrantytoReturnAuthRecord.setValue({
                            fieldId: "entity",
                            value: companyname,
                        });
                        log.debug("companyin RA", company_RA);

                        var item_RA = WarrantytoReturnAuthRecord.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "item",
                            value: item,
                            ignoreFieldChange: true,
                        });
                        log.debug("Item in RA", item_RA);

                        var amt_RA = WarrantytoReturnAuthRecord.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "amount",
                            value: amt,
                            ignoreFieldChange: true,
                        });
                        log.debug("amount in RA", amt_RA);

                        var taxcode_RA = WarrantytoReturnAuthRecord.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "taxcode",
                            value: taxcode,
                            ignoreFieldChange: true,
                        });
                        log.debug("taxcode_RA in RA", taxcode_RA);

                        WarrantytoReturnAuthRecord.commitLine({
                            sublistId: "item",
                        });

                        var recordId_ra = WarrantytoReturnAuthRecord.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true,
                        });
                        log.debug("Return_Auth_Id", recordId_ra);
                        var recordId_wc = customRecord.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true,
                        });
                        log.debug("custom record id", recordId_wc);


                        //----------------------------- RMA to Item Receipt creation------------------------//
                        // var objRecord = record.transform({
                        //     fromType: record.Type.RETURN_AUTHORIZATION,//Return Authorization
                        //     fromId: recordId_ra,
                        //     toType: record.Type.ITEM_RECEIPT,//
                        //     isDynamic: true,
                        // });
                        // log.debug("Item receipt record", objRecord);

                        // var itemreceipt_rec = objRecord.save({
                        //     enableSourcing: true,
                        //     ignoreMandatoryFields: true,
                        //   });
                        //   log.debug("Item receipt record id", itemreceipt_rec);

                        //-----------------------------credit memo creation------------------------//
                        // var WarrantytoCreditmemoRecord = record.create({
                        //   type: "creditmemo",
                        //   isDynamic: true,
                        // });

                        // var company_CM = WarrantytoCreditmemoRecord.setValue({
                        //   fieldId: "entity",
                        //   value: companyname,
                        // });
                        // log.debug("companyin CM", company_CM);
                        // //location

                        // var loation_CM = WarrantytoCreditmemoRecord.setValue({
                        //   fieldId: "location",
                        //   value: loc,
                        // });
                        // log.debug("locationin CM", loation_CM);

                        // var item_CM = WarrantytoCreditmemoRecord.setCurrentSublistValue({
                        //   sublistId: "item",
                        //   fieldId: "item",
                        //   value: item,
                        //   ignoreFieldChange: true,
                        // });
                        // log.debug("Item in CM", item_CM);

                        // var amt_CM = WarrantytoCreditmemoRecord.setCurrentSublistValue({
                        //   sublistId: "item",
                        //   fieldId: "amount",
                        //   value: amt,
                        //   ignoreFieldChange: true,
                        // });
                        // log.debug("amount in CM", amt_CM);

                        // var taxcode_CM = WarrantytoCreditmemoRecord.setCurrentSublistValue({
                        //   sublistId: "item",
                        //   fieldId: "taxcode",
                        //   value: taxcode,
                        //   ignoreFieldChange: true,
                        // });
                        // log.debug("taxcode_RA in CM", taxcode_CM);

                        // WarrantytoCreditmemoRecord.commitLine({
                        //   sublistId: "item",
                        // });
                        // var recordId_CM = WarrantytoCreditmemoRecord.save({
                        //   enableSourcing: true,
                        //   ignoreMandatoryFields: true,
                        // });
                        // log.debug("Creditmemo_Id", recordId_CM);


                    } else if (action == "2") {
                        //action:2-replacement, 3-repair  action == "3"
                        // var WarrantytoReturnAuthRecord = record.create({
                        //   type: "returnauthorization",
                        //   isDynamic: true,
                        // });
                        // log.debug("WarrantytoAuthRecod", WarrantytoReturnAuthRecord);
                        // var company_RA = WarrantytoReturnAuthRecord.setValue({
                        //   fieldId: "entity",
                        //   value: companyname,
                        // });
                        // log.debug("companyin RA", company_RA);
                        // var item_RA = WarrantytoReturnAuthRecord.setCurrentSublistValue({
                        //   sublistId: "item",
                        //   fieldId: "item",
                        //   value: item,
                        //   ignoreFieldChange: true,
                        // });
                        // log.debug("Item in RA", item_RA);
                        // var amt_RA = WarrantytoReturnAuthRecord.setCurrentSublistValue({
                        //   sublistId: "item",
                        //   fieldId: "amount",
                        //   value: amt,
                        //   ignoreFieldChange: true,
                        // });
                        // log.debug("amount in RA", amt_RA);
                        // var taxcode_RA = WarrantytoReturnAuthRecord.setCurrentSublistValue({
                        //   sublistId: "item",
                        //   fieldId: "taxcode",
                        //   value: taxcode,
                        //   ignoreFieldChange: true,
                        // });
                        // log.debug("taxcode_RA in RA", taxcode_RA);
                        // WarrantytoReturnAuthRecord.commitLine({
                        //   sublistId: "item",
                        // });
                        // var recordId = WarrantytoReturnAuthRecord.save({
                        //   enableSourcing: true,
                        //   ignoreMandatoryFields: true,
                        // });
                        // log.debug("Return_Auth_Id", recordId);
                    }
                }
            }
        } catch (error) {
            log.error({
                title: "Catch Block Error",
                details: error,
            });
            log.error({
                title: "Catch Block Error Full",
                details: JSON.stringify(error),
            });
        }
    }

    return {
        afterSubmit: afterSubmit,
    };
});