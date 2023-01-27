/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */

define(['N/ui/serverWidget', 'N/redirect', 'N/record', 'N/search'], function (serverWidget, redirect, record, search) {
    function onRequest(context) {
        try {
            if (context.request.method == 'GET') {
                var form = serverWidget.createForm({
                    id: 'whatsapp',
                    title: 'WhatsApp Setup'
                });
                form.addFieldGroup({
                    id: 'custpage_notification',
                    label: 'Notification Preference'
                });
                form.addFieldGroup({
                    id: 'custpage_details',
                    label: 'Details for Notification'
                });

                form.addFieldGroup({
                    id: 'custpage_preference',
                    label: 'Approval Preference'
                });
                form.addFieldGroup({
                    id: 'custpage_transaction',
                    label: 'Approval Transactions'
                });
                var enablet = form.addField({
                    id: 'custpage_enable',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'ENABLE WHATSAPP NOTIFICATION',
                    container: 'custpage_notification'
                });
                var cust = form.addField({
                    id: 'custpage_cust',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'CUSTOMER',
                    container: 'custpage_notification'
                });
                var vend = form.addField({
                    id: 'custpage_vend',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'VENDOR',
                    container: 'custpage_notification'
                });
                var emp = form.addField({
                    id: 'custpage_emp',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'EMPLOYEE',
                    container: 'custpage_notification'
                });

                var field = form.addField({
                    id: 'custpage_trans',
                    type: serverWidget.FieldType.MULTISELECT,
                    label: 'SELECT TRANSACTIONS FOR NOTIFICATION',
                    source: 'transactiontype',
                    container: 'custpage_notification'
                });
                var tselect = form.addField({
                    id: 'custpage_textarea',
                    type: serverWidget.FieldType.TEXTAREA,
                    label: 'TRANSACTIONS SELECTED',
                    container: 'custpage_notification'
                });
                // tselect.updateDisplayType({
                //     displayType: serverWidget.FieldDisplayType.DISABLED
                // });
                var winame = form.addField({
                    id: 'custpage_name',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'Name',
                    container: 'custpage_details'
                });
                var widcreated = form.addField({
                    id: 'custpage_datecreated',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'DATE CREATED',
                    container: 'custpage_details'
                });
                var widate = form.addField({
                    id: 'custpage_date',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'DATE',
                    container: 'custpage_details'
                });
                var wicreatedby = form.addField({
                    id: 'custpage_createdby',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'CREATED BY',
                    container: 'custpage_details'
                });
                var witotalamt = form.addField({
                    id: 'custpage_totalamount',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'TOTAL AMOUNT',
                    container: 'custpage_details'
                });
                var wisubs = form.addField({
                    id: 'custpage_subs',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'SUBSIDIARY',
                    container: 'custpage_details'
                });
                var wiloc = form.addField({
                    id: 'custpage_loc',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'LOCATION',
                    container: 'custpage_details'
                });
                var widept = form.addField({
                    id: 'custpage_dept',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'DEPARTMENT',
                    container: 'custpage_details'
                });
                var wicls = form.addField({
                    id: 'custpage_cls',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'CLASS',
                    container: 'custpage_details'
                });
                var wiatt = form.addField({
                    id: 'custpage_send',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'SEND ATTACHMENT',
                    container: 'custpage_details'
                });
                var wireq = form.addField({
                    id: 'custpage_request',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'SEND APPROVAL REQUEST',
                    container: 'custpage_preference'
                });
                var winot = form.addField({
                    id: 'custpage_appnotify',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'SEND APPROVAL NOTIFICATION TO REQUESTER',
                    container: 'custpage_preference'
                });
                var wiso = form.addField({
                    id: 'custpage_so',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'SALES ORDER',
                    container: 'custpage_transaction'
                });
                var wipo = form.addField({
                    id: 'custpage_po',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'PURCHASE ORDER',
                    container: 'custpage_transaction'
                });
                var wibill = form.addField({
                    id: 'custpage_bill',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'BILLS',
                    container: 'custpage_transaction'
                });
                var wiinv = form.addField({
                    id: 'custpage_inv',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'INVOICE',
                    container: 'custpage_transaction'
                });
                form.addSubmitButton({
                    label: 'Save'
                });
                var whatsAppSearchObj = search.create({
                    type: "customrecord516",
                    filters: [],
                    columns: [
                        search.createColumn({
                            name: "custrecord1404",
                            label: "Enable Whatsapp Notification"
                        }),
                        search.createColumn({
                            name: "custrecord1406",
                            label: "Select Transactions for Notification"
                        }),
                        search.createColumn({
                            name: "custrecord1424",
                            label: "Customer"
                        }),
                        search.createColumn({
                            name: "custrecord1425",
                            label: "Vendor"
                        }),
                        search.createColumn({
                            name: "custrecord1426",
                            label: "Employee"
                        }),
                        search.createColumn({
                            name: "custrecord1408",
                            label: "Name"
                        }),
                        search.createColumn({
                            name: "custrecord1409",
                            label: "Date Created"
                        }),
                        search.createColumn({
                            name: "custrecord1411",
                            label: "Created By"
                        }),
                        search.createColumn({
                            name: "custrecord1412",
                            label: "Total Amount"
                        }),
                        search.createColumn({
                            name: "custrecord1413",
                            label: "Subsidiary "
                        }),
                        search.createColumn({
                            name: "custrecord1414",
                            label: "Location"
                        }),
                        search.createColumn({
                            name: "custrecord1405",
                            label: "Send Approval Request "
                        }),
                        search.createColumn({
                            name: "custrecord1407",
                            label: "Send Approval Notification to Requester "
                        }),
                        search.createColumn({
                            name: "custrecord1418",
                            label: "Sales Order"
                        }),
                        search.createColumn({
                            name: "custrecord1420",
                            label: "Purchase Order"
                        }),
                        search.createColumn({
                            name: "custrecord1419",
                            label: "Invoice"
                        }),
                        search.createColumn({
                            name: "custrecord1410",
                            label: "Date"
                        }),
                        search.createColumn({
                            name: "custrecord1415",
                            label: "Department "
                        }),
                        search.createColumn({
                            name: "custrecord1421",
                            label: "Bills"
                        }),
                        search.createColumn({
                            name: "custrecord1416",
                            label: "Class"
                        }),
                        search.createColumn({
                            name: "custrecord1417",
                            label: "Send Attachment"
                        })
                    ]
                });
                var searchResult = whatsAppSearchObj.run().getRange({
                    start: 0,
                    end: 1
                });
                log.debug("searchResult.length", searchResult.length);

                if (searchResult.length != 0) {
                    for (var w in searchResult) {
                        var wi_id = searchResult[w].id;
                        log.debug("wi_id ", wi_id);


                        var newenable = searchResult[w].getValue({
                            name: "custrecord1404",
                            label: "Enable Whatsapp Notification"

                        });
                        log.debug("enablewiupdaterecord", newenable);
                        var newcust = searchResult[w].getValue({
                            name: "custrecord1424",
                            label: "Customer"

                        });
                        log.debug("newcust", newcust);
                        var newtrans = searchResult[w].getValue({
                            name: "custrecord1406",
                            label: "Select Transactions for Notification"

                        });
                        log.debug("newtrans", newtrans);
                        var newvend = searchResult[w].getValue({
                            name: "custrecord1425",
                            label: "Vendor"

                        });
                        log.debug("newvend", newvend);
                        var newemp = searchResult[w].getValue({
                            name: "custrecord1426",
                            label: "Employee"

                        });
                        log.debug("newemp", newemp);
                        var newname = searchResult[w].getValue({
                            name: "custrecord1408",
                            label: "Name"

                        });
                        log.debug("newname", newname);
                        var newdcreated = searchResult[w].getValue({
                            name: "custrecord1409",
                            label: "Date Created"

                        });
                        log.debug("newdcreated", newdcreated);
                        var newdate = searchResult[w].getValue({
                            name: "custrecord1410",
                            label: "Date"

                        });
                        log.debug("newdate", newdate);
                        var newcreatedby = searchResult[w].getValue({
                            name: "custrecord1411",
                            label: "Created By"

                        });
                        log.debug("newcreatedby", newcreatedby);
                        var newtotalamnt = searchResult[w].getValue({
                            name: "custrecord1412",
                            label: "Total Amount"

                        });
                        log.debug("newtotalamnt", newtotalamnt);
                        var newsubs = searchResult[w].getValue({
                            name: "custrecord1413",
                            label: "Subsidiary "

                        });
                        log.debug("newsubs", newsubs);
                        var newloc = searchResult[w].getValue({
                            name: "custrecord1414",
                            label: "Location"

                        });
                        log.debug("newloc", newloc);
                        var newdept = searchResult[w].getValue({
                            name: "custrecord1415",
                            label: "Department "

                        });
                        log.debug("newdept", newdept);
                        var newcls = searchResult[w].getValue({
                            name: "custrecord1416",
                            label: "Class"

                        });
                        log.debug("newcls", newcls);
                        var newsendatt = searchResult[w].getValue({
                            name: "custrecord1417",
                            label: "Send Attachment"

                        });
                        log.debug("newsendatt", newsendatt);
                        var newapprqt = searchResult[w].getValue({
                            name: "custrecord1405",
                            label: "Send Approval Request "

                        });
                        log.debug("newapprqt", newapprqt);
                        var newappnotif = searchResult[w].getValue({
                            name: "custrecord1407",
                            label: "Send Approval Notification to Requester "

                        });
                        log.debug("newappnotif", newappnotif);
                        var newso = searchResult[w].getValue({
                            name: "custrecord1418",
                            label: "Sales Order"

                        });
                        log.debug("newso", newso);
                        var newpo = searchResult[w].getValue({
                            name: "custrecord1420",
                            label: "Purchase Order"

                        });
                        log.debug("newpo", newpo);
                        var newbill = searchResult[w].getValue({
                            name: "custrecord1421",
                            label: "Bills"

                        });
                        log.debug("newbill", newbill);
                        var newinv = searchResult[w].getValue({
                            name: "custrecord1419",
                            label: "Invoice"

                        });
                        log.debug("newinv", newinv);

                        if (newenable) {
                            // log.debug("newcustinsideif",newcust);
                            enablet.defaultValue = 'T';
                        }
                        if (newcust) {
                            //log.debug("newcustinsideif",newcust);
                            cust.defaultValue = 'T';
                        }
                        if (newvend) {
                            //log.debug("newcustinsideif",newcust);
                            vend.defaultValue = 'T';
                        }
                        if (newemp) {
                            //log.debug("newcustinsideif",newcust);
                            emp.defaultValue = 'T';
                        }
                        var newtemp = newtrans.split(",");
                        log.debug("newtemp", newtemp);
                        if (newtemp) {
                            log.debug("newtempinsideif", newtemp);
                            field.defaultValue = newtemp;
                        }
                        if (newname) {
                            //log.debug("newcustinsideif",newcust);
                            winame.defaultValue = 'T';
                        }
                        if (newdcreated) {
                            //log.debug("newcustinsideif",newcust);
                            widcreated.defaultValue = 'T';
                        }
                        if (newdate) {
                            //log.debug("newcustinsideif",newcust);
                            widate.defaultValue = 'T';
                        }
                        if (newcreatedby) {
                            //log.debug("newcustinsideif",newcust);
                            wicreatedby.defaultValue = 'T';
                        }
                        if (newtotalamnt) {
                            //log.debug("newcustinsideif",newcust);
                            witotalamt.defaultValue = 'T';
                        }
                        if (newsubs) {
                            //log.debug("newcustinsideif",newcust);
                            wisubs.defaultValue = 'T';
                        }
                        if (newloc) {
                            //log.debug("newcustinsideif",newcust);
                            wiloc.defaultValue = 'T';
                        }
                        if (newdept) {
                            //log.debug("newcustinsideif",newcust);
                            widept.defaultValue = 'T';
                        }
                        if (newcls) {
                            //log.debug("newcustinsideif",newcust);
                            wicls.defaultValue = 'T';
                        }
                        if (newsendatt) {
                            //log.debug("newcustinsideif",newcust);
                            wiatt.defaultValue = 'T';
                        }
                        if (newapprqt) {
                            //log.debug("newcustinsideif",newcust);
                            wireq.defaultValue = 'T';
                        }
                        if (newappnotif) {
                            //log.debug("newcustinsideif",newcust);
                            winot.defaultValue = 'T';
                        }
                        if (newso) {
                            //log.debug("newcustinsideif",newcust);
                            wiso.defaultValue = 'T';
                        }
                        if (newpo) {
                            //log.debug("newcustinsideif",newcust);
                            wipo.defaultValue = 'T';
                        }
                        if (newinv) {
                            //log.debug("newcustinsideif",newcust);
                            wiinv.defaultValue = 'T';
                        }
                        if (newbill) {
                            //log.debug("newcustinsideif",newcust);
                            wibill.defaultValue = 'T';
                        }
                    }
                }

                form.clientScriptModulePath = 'SuiteScripts/WI_CS_Main.js';
                context.response.writePage(form);
            } else {

                var request = context.request;

                var enable = request.parameters.custpage_enable;
                var emp = request.parameters.custpage_emp;
                var cust = request.parameters.custpage_cust;
                var vend = request.parameters.custpage_vend;
                var field = request.parameters.custpage_trans;
                var tselect = request.parameters.custpage_textarea;
                var winame = request.parameters.custpage_name;
                var widcreated = request.parameters.custpage_datecreated;
                var widate = request.parameters.custpage_date;
                var wicreatedby = request.parameters.custpage_createdby;
                var witotalamt = request.parameters.custpage_totalamount;
                var wisubs = request.parameters.custpage_subs;
                var wiloc = request.parameters.custpage_loc;
                var widept = request.parameters.custpage_dept;
                var wicls = request.parameters.custpage_cls;
                var wiatt = request.parameters.custpage_send;
                var wireq = request.parameters.custpage_request;
                var winot = request.parameters.custpage_appnotify;
                var wiso = request.parameters.custpage_so;
                var wipo = request.parameters.custpage_po;
                var wibill = request.parameters.custpage_bill;
                var wiinv = request.parameters.custpage_inv;
                log.debug('emp', emp);
                log.debug('cust', cust);
                log.debug('vend', vend);
                log.debug('enable ', enable);
                log.debug('field', field); //split("\u0005")
                var temp = field.split("\u0005");
                log.debug('temp', temp);
                log.debug('tselect', tselect);
                log.debug('winame ', winame);
                log.debug('widcreated', widcreated);
                log.debug('wicreatedby', wicreatedby);
                log.debug('witotalamt', witotalamt);
                log.debug('wisubs', wisubs);
                log.debug('wiloc ', wiloc);
                log.debug('widept', widept);
                log.debug('wicls', wicls);
                log.debug('wiatt', wiatt);
                log.debug('wireq', wireq);
                log.debug('winot', winot);
                log.debug('wiso ', wiso);
                log.debug('wipo ', wipo);
                log.debug('wibill ', wibill);
                log.debug('wiinv', wiinv);

                var whatsAppSearchObj = search.create({
                    type: "customrecord516",
                    filters: [],
                    columns: [
                        search.createColumn({
                            name: "custrecord1404",
                            label: "Enable Whatsapp Notification"
                        }),
                        search.createColumn({
                            name: "custrecord1406",
                            label: "Select Transactions for Notification"
                        }),
                        search.createColumn({
                            name: "custrecord1424",
                            label: "Customer"
                        }),
                        search.createColumn({
                            name: "custrecord1425",
                            label: "Vendor"
                        }),
                        search.createColumn({
                            name: "custrecord1426",
                            label: "Employee"
                        }),
                        search.createColumn({
                            name: "custrecord1408",
                            label: "Name"
                        }),
                        search.createColumn({
                            name: "custrecord1409",
                            label: "Date Created"
                        }),
                        search.createColumn({
                            name: "custrecord1411",
                            label: "Created By"
                        }),
                        search.createColumn({
                            name: "custrecord1412",
                            label: "Total Amount"
                        }),
                        search.createColumn({
                            name: "custrecord1413",
                            label: "Subsidiary "
                        }),
                        search.createColumn({
                            name: "custrecord1414",
                            label: "Location"
                        }),
                        search.createColumn({
                            name: "custrecord1405",
                            label: "Send Approval Request "
                        }),
                        search.createColumn({
                            name: "custrecord1407",
                            label: "Send Approval Notification to Requester "
                        }),
                        search.createColumn({
                            name: "custrecord1418",
                            label: "Sales Order"
                        }),
                        search.createColumn({
                            name: "custrecord1420",
                            label: "Purchase Order"
                        }),
                        search.createColumn({
                            name: "custrecord1419",
                            label: "Invoice"
                        })
                    ]
                });
                var searchResult = whatsAppSearchObj.run().getRange({
                    start: 0,
                    end: 1
                });
                log.debug("searchResult.length", searchResult.length);
                if (searchResult.length != 0) {

                    var wi_id = searchResult[0].id;
                    log.debug("wi_id", wi_id);




                    if (wi_id != 0) {
                        var wiObj = record.load({
                            type: 'customrecord516',
                            id: wi_id
                        });

                        // recObj.getField('custpage_configrecid').isDisabled = true;
                        if (enable == 'T') {
                            log.debug("hi inside enable");
                            wiObj.setValue({
                                fieldId: 'custrecord1404',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1404',
                                value: false
                            });
                        }
                        if (emp == 'T') {
                            log.debug("hi inside enable");
                            wiObj.setValue({
                                fieldId: 'custrecord1426',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1426',
                                value: false
                            });
                        }
                        if (cust == 'T') {
                            log.debug("hi inside enable");
                            wiObj.setValue({
                                fieldId: 'custrecord1424',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1424',
                                value: false
                            });
                        }
                        if (vend == 'T') {
                            log.debug("hi inside enable");
                            wiObj.setValue({
                                fieldId: 'custrecord1425',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1425',
                                value: false
                            });
                        }

                        if (field)
                            log.debug('fieldiffffff', field);
                        log.debug('fieldtemp', temp);
                        wiObj.setValue({
                            fieldId: 'custrecord1406',
                            value: temp
                        });
                        if (winame == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1408',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1408',
                                value: false
                            });
                        }

                        if (widcreated == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1409',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1409',
                                value: false
                            });
                        }


                        if (widate == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1410',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1410',
                                value: false
                            });
                        }
                        if (wicreatedby == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1411',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1411',
                                value: false
                            });
                        }
                        if (witotalamt == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1412',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1412',
                                value: false
                            });
                        }
                        if (wisubs == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1413',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1413',
                                value: false
                            });
                        }
                        if (wiloc == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1414',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1414',
                                value: false
                            });
                        }
                        if (widept == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1415',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1415',
                                value: false
                            });
                        }
                        if (wicls == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1416',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1416',
                                value: false
                            });
                        }
                        if (wiatt == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1417',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1417',
                                value: false
                            });
                        }
                        if (wireq == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1405',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1405',
                                value: false
                            });
                        }
                        if (winot == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1407',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1407',
                                value: false
                            });
                        }
                        if (wiso == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1418',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1418',
                                value: false
                            });
                        }
                        if (wipo == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1420',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1420',
                                value: false
                            });
                        }
                        if (wibill == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1421',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1421',
                                value: false
                            });
                        }
                        if (wiinv == 'T') {
                            wiObj.setValue({
                                fieldId: 'custrecord1419',
                                value: true
                            });
                        } else {
                            wiObj.setValue({
                                fieldId: 'custrecord1419',
                                value: false
                            });
                        }
                        var cust_rec = wiObj.save();

                        var html = '<html><body><h3 style="font-size:12pt ">WhatsApp Setup Record Updated</h3></body></html>';
                        context.response.write(html + cust_rec);

                    }

                } else {
                    var recObj = record.create({
                        type: 'customrecord516',
                        isDynamic: true,
                    });
                    if (emp == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1426',
                            value: true
                        });
                    if (cust == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1424',
                            value: true
                        });
                    if (vend == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1425',
                            value: true
                        });
                    if (enable == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1404',
                            value: true
                        });

                    recObj.setValue({
                        fieldId: 'custrecord1406',
                        value: temp
                    });
                    if (winame == 'T')

                        recObj.setValue({
                            fieldId: 'custrecord1408',
                            value: true
                        });

                    if (widcreated == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1409',
                            value: true
                        });


                    if (widate == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1410',
                            value: true
                        });
                    if (wicreatedby == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1411',
                            value: true
                        });
                    if (witotalamt == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1412',
                            value: true
                        });
                    if (wisubs == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1413',
                            value: true
                        });
                    if (wiloc == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1414',
                            value: true
                        });
                    if (widept == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1415',
                            value: true
                        });
                    if (wicls == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1416',
                            value: true
                        });
                    if (wiatt == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1417',
                            value: true
                        });
                    if (wireq == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1405',
                            value: true
                        });
                    if (winot == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1407',
                            value: true
                        });
                    if (wiso == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1418',
                            value: true
                        });
                    if (wipo == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1420',
                            value: true
                        });
                    if (wibill == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1421',
                            value: true
                        });
                    if (wiinv == 'T')
                        recObj.setValue({
                            fieldId: 'custrecord1419',
                            value: true
                        });

                    var save = recObj.save();
                    //context.response.write('record saved ');
                    log.debug('save', save);
                    var html = '<html><body><h3 style="font-size:12pt ">Record saved Successfully</h3></body></html>';
                    context.response.write(html + save);
                }


            }
        } catch (e) {
            log.debug('onRequest:error', e);
        }
    }
    return {
        onRequest: onRequest
    };
});