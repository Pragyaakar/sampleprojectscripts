/** 
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

//Load two standard modules.
define(['N/record', 'N/search', 'N/runtime', 'N/ui/serverWidget', 'N/email'],
    // Add the callback function.
    function (record, search, runtime, serverWidget, email) {
        // In the beforeLoad function, disable the Notes field.
        function beforeLoad(scriptContext) {
            try {

                if (scriptContext.type == 'view') {
                    var obj_record = scriptContext.newRecord;
                    var i_recordId = scriptContext.newRecord.id;
                    var s_record_type = scriptContext.newRecord.type;
                    var currentrecord = scriptContext.currentRecord;
                    var user = runtime.getCurrentUser();
                    log.debug("user", user);

                    //	  if(i_project_id && parseInt(i_invoice_layout) == parseInt(4))//MITL MIMS INVOICE LAYOUT
                    {
                        scriptContext.form.addButton({
                            id: "custpage_approve",
                            label: "Approve",
                            functionName: "onApproveButtonClick"
                        });

                        scriptContext.form.addButton({
                            id: "custpage_reject",
                            label: "Reject",
                            functionName: "onRejectButtonClick"
                        });

                    } //end of if
                } //end of if(scriptContext.type == 'view')

                if (scriptContext.type == 'edit' || scriptContext.type == 'create') {
                    // var obj_record = scriptContext.newRecord;
                    // var i_recordId = scriptContext.newRecord.id; 
                    // var s_record_type = scriptContext.newRecord.type;
                    var currentrecord = scriptContext.currentRecord;
                    var recForm = scriptContext.form;
                    log.debug('formrecord', recForm);
                    var Objrecord = scriptContext.newRecord;
                    log.debug('newRecord', Objrecord);
                    var customForm = Objrecord.getValue({
                        fieldId: 'customform'
                    });
                    log.debug('customForm ', customForm);

                    //  var subsidiary = Objrecord.getValue({fieldId:'subsidiary'});//getting field values..
                    //  log.debug('subsidiarygetValue',subsidiary);

                    //  var location = Objrecord.getValue({fieldId:'location'});
                    //  log.debug('locationgetValue',location);

                    //  var dept = Objrecord.getValue({fieldId:'department'});
                    //  log.debug('dept',dept);

                    // var vendor = Objrecord.getValue({fieldId:'entity'});
                    // log.debug('vendor',vendor);

                    var recordType = Objrecord.type;
                    log.debug('type of record', recordType);

                    if (recordType == 'customrecord_ah_leave') {

                        var newType = "Leave";
                    }
                    log.debug('newType', newType);
                    if (customForm == 225) {
                        var newForm = "Custom Leave Record Form";
                    }
                    log.debug("newForm", newForm);

                    // if(scriptContext.type.fieldId == 'entity')


                    var SearchObj = search.create({
                        type: "customrecord_pre",
                        filters: [
                            ["custrecord_preform", "is", newForm],
                            "AND",
                            ["custrecord_prett", "is", newType]
                        ],
                        columns: [
                            // search.createColumn({
                            //     name: "custrecord1403",
                            //     label: "Vendor"
                            // }),
                            search.createColumn({
                                name: "custrecord_configlink",
                                label: "Configuration Link"
                            }),
                            search.createColumn({
                                name: "custrecord_preform",
                                label: "Form Name"
                            }),
                            search.createColumn({
                                name: "custrecord_prett",
                                label: "Record Type"
                            }),
                            search.createColumn({
                                name: "custrecord_precls",
                                label: "Class"
                            }),
                            search.createColumn({
                                name: "custrecord_precnt",
                                label: "Country"
                            }),
                            search.createColumn({
                                name: "custrecord_preloc",
                                label: "Location"
                            }),
                            search.createColumn({
                                name: "custrecord_predept",
                                label: "Department"
                            }),
                            search.createColumn({
                                name: "custrecord_presubs",
                                label: "Subsidiary"
                            }),
                            search.createColumn({
                                name: "custrecord_precs1",
                                label: "Attendance"
                            }),
                            search.createColumn({
                                name: "custrecord_prefel",
                                label: "Earned Leave"
                            }),
                            search.createColumn({
                                name: "custrecord_prefcomp",
                                label: "Comp Off"
                            }),
                            search.createColumn({
                                name: "custrecord_prefirst",
                                label: "First Approver"
                            }),
                            search.createColumn({
                                name: "custrecord_presecond",
                                label: "Second Approver"
                            }),
                            search.createColumn({
                                name: "custrecord_prethird",
                                label: "Third Approver"
                            }),
                            search.createColumn({
                                name: "custrecord_fourth",
                                label: "Fourth Approver"
                            }),
                            search.createColumn({
                                name: "custrecord_prefifth",
                                label: "Fifth Approver"
                            }),
                            search.createColumn({
                                name: "custrecord_sixth",
                                label: "Sixth Approver"
                            }),
                            search.createColumn({
                                name: "custrecord_ahseven",
                                label: "Seventh Approver"
                            }),
                            search.createColumn({
                                name: "custrecord_preal",
                                label: "Approval Level"
                            })
                        ]
                    });



                    var searchResult = SearchObj.run().getRange({
                        start: 0,
                        end: 1000
                    });
                    log.debug("searchResult.length", searchResult.length);
                    if (searchResult.length != 0) {
                        for (var ue in searchResult) {
                            // var vend = searchResult[ue].getText({
                            //     name: "custrecord1403",
                            //     label: "Vendor"
                            // });
                            // log.debug("vend", vend);
                            // var subsValue = searchResult[ue].getText({
                            //     name: "custrecord_presubs",
                            //     label: "Subsidiary"
                            // });
                            // log.debug("subsValue", subsValue);
                            // var deptValue = searchResult[ue].getText({
                            //     name: "custrecord_predept",
                            //     label: "Department"
                            // });
                            // log.debug("deptValue ", deptValue);
                            // var clsValue = searchResult[ue].getText({
                            //     name: "custrecord_precls",
                            //     label: "Class"
                            // });
                            // log.debug("clsValue  ", clsValue);
                            // var locationValue = searchResult[ue].getText({
                            //     name: "custrecord_preloc",
                            //     label: "Location"
                            // });
                            // log.debug("locationValue", locationValue);
                            var alevelValue = searchResult[ue].getValue({
                                name: "custrecord_preal",
                                label: "Approval Level"
                            });
                            log.debug("alevelValue", alevelValue);
                            var firstApprover = searchResult[ue].getValue({
                                name: "custrecord_prefirst",
                                label: "First Approver"
                            });
                            log.debug("firstApprover", firstApprover);
                            var secondApprover = searchResult[ue].getValue({
                                name: "custrecord_presecond",
                                label: "Second Approver"
                            });
                            log.debug("secondApprover", secondApprover);
                            var thirdApprover = searchResult[ue].getValue({
                                name: "custrecord_prethird",
                                label: "Third Approver"
                            });
                            log.debug("thirdApprover", thirdApprover);
                            var fourthApprover = searchResult[ue].getValue({
                                name: "custrecord_fourth",
                                label: "Fourth Approver"
                            });
                            log.debug(" fourthApprover", fourthApprover);
                            var fifthApprover = searchResult[ue].getValue({
                                name: "custrecord_prefifth",
                                label: "Fifth Approver"
                            });
                            log.debug("fifthApprover", fifthApprover);
                            var sixthApprover = searchResult[ue].getValue({
                                name: "custrecord_sixth",
                                label: "Sixth Approver"
                            });
                            log.debug("sixthApprover", sixthApprover);
                            var seventhApprover = searchResult[ue].getValue({
                                name: "custrecord_ahseven",
                                label: "Seventh Approver"
                            });
                            log.debug("seventhApprover", seventhApprover);
                            // if (vend)
                            //     log.debug("vend");
                            //     Objrecord.setValue({
                            //     fieldId: 'entity',
                            //     value: vendor
                            // // });
                            // if (subsValue)
                            //     log.debug("subsidiary");
                            //     Objrecord.setValue({
                            //     fieldId: 'subsidiary',
                            //     value: subsValue
                            // });
                            // if (deptValue)
                            //     Objrecord.setValue({
                            //         fieldId: 'department',
                            //         value: deptValue
                            //     });
                            // if (clsValue)
                            //     Objrecord.setValue({
                            //         fieldId: 'class',
                            //         value: clsValue
                            //     });
                            // if (locationValue)
                            //     Objrecord.setValue({
                            //         fieldId: 'location',
                            //         value: locationValue
                            //     });
                            if (alevelValue)
                                log.debug('alevelValue', alevelValue);
                            Objrecord.setValue({
                                fieldId: 'custrecord_ah_al_leave',
                                value: alevelValue
                            });
                            // if (firstApprover)
                            // log.debug('firstApprover', firstApprover);
                            //     Objrecord.setValue({
                            //     fieldId: 'ccustrecord_ah_fa_leaver',
                            //     value: firstApprover
                            // });

                            // if (secondApprover)
                            // log.debug('secondApprover',secondApprover);
                            //     Objrecord.setValue({
                            //     fieldId: 'custbody_ah_second_approver',
                            //     value: secondApprover
                            // });

                            // if (thirdApprover)
                            // log.debug('thirdApprover',thirdApprover);
                            //     Objrecord.setValue({
                            //     fieldId: 'custbody_ah_third_approver',
                            //     value: thirdApprover
                            // });
                            // if (fourthApprover)
                            // log.debug('fourthApprover',fourthApprover);
                            //     Objrecord.setValue({
                            //     fieldId: 'custbody_ah_fourth_approver',
                            //     value: fourthApprover
                            // });
                            // if (fifthApprover)
                            // log.debug('fifthApprover',fifthApprover);
                            //     Objrecord.setValue({
                            //     fieldId: 'custbody_ah_fifth_approver',
                            //     value: fifthApprover
                            // });
                            // if (sixthApprover)
                            // log.debug('sixthApprover',sixthApprover);
                            //     Objrecord.setValue({
                            //     fieldId: 'custbody_ah_sixth_approver',
                            //     value: sixthApprover
                            // });
                            // if (seventhApprover)
                            // log.debug('seventhApprover',seventhApprover);
                            //     Objrecord.setValue({
                            //     fieldId: 'custbody_ah_seventh_approver',
                            //     value: seventhApprover
                            // });   
                        }
                    }
                } //end of if(scriptContext.type == 'create')
            } //end of try block
            catch (e) {
                log.debug('Exception:==', e);
            } //end of catch block	
        } //end of function beforeLoad(scriptContext) 





        return {
            beforeLoad: beforeLoad,


        };
    });