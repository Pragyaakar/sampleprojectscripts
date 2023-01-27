/**
 * @NApiVersion 2.0
 * @NScriptType clientScript
 * @NModuleScope Public
 *
 *Name       : Leave entry update
 *Purpose    : Different Validation on LMS Leave entries primarily on the client side, which is UI-related
 *Created On : 07-Dec-2022
 *Author     : Binod Kamat
 *Script Type : clientScript
 *Version    : 2.0
 *
 */

define(['N/record', 'N/ui/dialog', 'N/search'], function (record, dialog, search) {

    function fieldChange(context) {
        try {
            var currentRecord = context.currentRecord;
            var field = context.fieldId;


            if (field == 'custrecord_lms_leave_type') {
                /*   currentRecord.setValue({
                       fieldId: "custrecord_lms_to_date",
                       value: ""
                   });
                   currentRecord.setValue({
                       fieldId: "custrecord_lms_number_of_days",
                       value: ""
                   }); currentRecord.setValue({
                       fieldId: "custrecord_lms_from_date",
                       value: ""
                   });
   
   */

                var empId = currentRecord.getValue("custrecord_lms_employee");
                var leaveType = currentRecord.getValue("custrecord_lms_leave_type");
                var leaveSearch = search.create({
                    type: "customrecord_lms_employee_leave",
                    filters: [

                        ["custrecord_lms_parent_record", "ANYOF", [empId]],
                        "AND",
                        ["custrecord_lms_leave_type_1", "ANYOF", [leaveType]]
                    ],
                    columns: [search.createColumn({
                        name: 'custrecord_leave_balance_lms'
                    })]
                });


                try {
                    var ids = (leaveSearch.run().getRange({
                        start: 0,
                        end: 50
                    }))[0]["id"];
                    leaveSearch.run().each(function (result) {
                        resultleavebalance = result.getValue({
                            name: 'custrecord_leave_balance_lms'
                        });
                        if (ids >= 0) {
                            currentRecord.setValue({
                                fieldId: "custrecord_lms_leave_balance",
                                value: resultleavebalance
                            })
                            log.debug({
                                title: 'Leave Balance save search Result : ',
                                details: resultleavebalance
                            });
                        } else {
                            alert("It seems you are not applicable for this leave !")
                            currentRecord.setValue({
                                fieldId: "custrecord_lms_leave_balance",
                                value: ""
                            })
                        }
                    })
                } catch (e) {
                    alert("It seems you are not applicable for this leave !")
                    currentRecord.setValue({
                        fieldId: "custrecord_lms_leave_balance",
                        value: ""
                    })
                }







            }
            if (field == 'custrecord_lms_half_day') {
                if (currentRecord.getValue("custrecord_lms_half_day") == false) {
                    currentRecord.setValue({
                        fieldId: "custrecord_lms_number_of_days",
                        value: ""
                    })
                }
            }
            if (field == 'custrecord_lms_to_date') {
                if (currentRecord.getValue("custrecord_lms_half_day") == true) {
                    var fromDate = Date.parse(currentRecord.getValue("custrecord_lms_from_date"));
                    var toDate = Date.parse(currentRecord.getValue("custrecord_lms_to_date"));
                    if (fromDate > 1 && toDate > 1) {
                        if (fromDate != toDate) {
                            dialog.alert({
                                title: "Half day leave : ",
                                message: "Please select same both from date and to Date "
                            })
                            currentRecord.setValue({
                                fieldId: "custrecord_lms_number_of_days",
                                value: ""
                            });
                            return;
                        } else {
                            currentRecord.setValue({
                                fieldId: "custrecord_lms_number_of_days",
                                value: 0.5
                            })
                            return;
                        }
                    } else {
                        dialog.alert({
                            title: "Half day leave : ",
                            message: "Please select both from date and to Date "
                        })
                        currentRecord.setValue({
                            fieldId: "custrecord_lms_to_date",
                            value: ""
                        });
                        currentRecord.setValue({
                            fieldId: "custrecord_lms_number_of_days",
                            value: ""
                        });
                        return;
                    }
                }

                var fromDate = Date.parse(currentRecord.getValue("custrecord_lms_from_date"));
                if (fromDate > 1) {

                    var toDate = Date.parse(currentRecord.getValue("custrecord_lms_to_date"));
                    if (fromDate > toDate) {
                        dialog.alert({
                            title: "Wrong From Date and to Date",
                            message: "Please select accurate dates : <b>to Date</b> should after <b>from Date</b>"
                        })

                        currentRecord.setValue({
                            fieldId: "custrecord_lms_number_of_days",
                            value: ""
                        });
                    }
                    if (fromDate <= toDate) {
                        currentRecord.setValue({
                            fieldId: "custrecord_lms_number_of_days",
                            value: ((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1
                        })
                        if ((currentRecord.getValue("custrecord_lms_leave_balance") - currentRecord.getValue("custrecord_lms_number_of_days")) < 0) {
                            currentRecord.setValue({
                                fieldId: "custrecord_lms_to_date",
                                value: ""
                            });
                            currentRecord.setValue({
                                fieldId: "custrecord_lms_number_of_days",
                                value: ""
                            });
                            dialog.alert({
                                title: " leave Limit Exceeded: ",
                                message: "Your Leave days Limit exceeded from normal available range "
                            })
                        }
                    }

                }


            }
            if (field == 'custrecord_lms_from_date') {
                if (currentRecord.getValue("custrecord_lms_half_day") == true) {
                    var fromDate = Date.parse(currentRecord.getValue("custrecord_lms_from_date"));
                    var toDate = Date.parse(currentRecord.getValue("custrecord_lms_to_date"));
                    if (fromDate > 1 && toDate > 1) {
                        if (fromDate != toDate) {
                            dialog.alert({
                                title: "Half day leave : ",
                                message: "Please select same both from date and to Date "
                            })
                            currentRecord.setValue({
                                fieldId: "custrecord_lms_number_of_days",
                                value: ""
                            });
                            return;
                        } else {
                            currentRecord.setValue({
                                fieldId: "custrecord_lms_number_of_days",
                                value: 0.5
                            })
                            return;
                        }
                    } else {
                        dialog.alert({
                            title: "Half day leave : ",
                            message: "Please select both from date and to Date "
                        })
                        currentRecord.setValue({
                            fieldId: "custrecord_lms_to_date",
                            value: ""
                        });
                        currentRecord.setValue({
                            fieldId: "custrecord_lms_number_of_days",
                            value: ""
                        });
                        return;
                    }
                }
                var toDate = Date.parse(currentRecord.getValue("custrecord_lms_to_date"));
                if (toDate > 1) {
                    var fromDate = Date.parse(currentRecord.getValue("custrecord_lms_from_date"));


                    if (fromDate > toDate) {
                        dialog.alert({
                            title: "Wrong From Date and to Date",
                            message: "Please select accurate dates : <b>to Date</b> should after <b>from Date</b>"
                        })

                        currentRecord.setValue({
                            fieldId: "custrecord_lms_number_of_days",
                            value: ""
                        });
                    }
                    if (fromDate <= toDate) {
                        currentRecord.setValue({
                            fieldId: "custrecord_lms_number_of_days",
                            value: (toDate - fromDate) / (1000 * 60 * 60 * 24)
                        })
                        if ((currentRecord.getValue("custrecord_lms_leave_balance") - currentRecord.getValue("custrecord_lms_number_of_days")) < 0) {
                            currentRecord.setValue({
                                fieldId: "custrecord_lms_to_date",
                                value: ""
                            });
                            currentRecord.setValue({
                                fieldId: "custrecord_lms_number_of_days",
                                value: ""
                            });
                            dialog.alert({
                                title: " leave Limit Exceeded: ",
                                message: "Your Leave days Limit exceeded from normal available range "
                            })
                        }
                    }

                }


            }



            if (field == 'custrecord_lms_half_day') {
                if (currentRecord.getValue("custrecord_lms_half_day") == true) {
                    var fromDate = Date.parse(currentRecord.getValue("custrecord_lms_from_date"));
                    var toDate = Date.parse(currentRecord.getValue("custrecord_lms_to_date"));
                    if (fromDate > 1 && toDate > 1) {
                        if (fromDate != toDate) {
                            dialog.alert({
                                title: "Half day leave : ",
                                message: "Please select same both from date and to Date "
                            })

                            currentRecord.setValue({
                                fieldId: "custrecord_lms_number_of_days",
                                value: ""
                            });
                        } else {
                            currentRecord.setValue({
                                fieldId: "custrecord_lms_number_of_days",
                                value: 0.5
                            })
                        }
                    } else {
                        dialog.alert({
                            title: "Half day leave : ",
                            message: "Please select both from date and to Date "
                        })

                        currentRecord.setValue({
                            fieldId: "custrecord_lms_number_of_days",
                            value: ""
                        });
                    }
                }
            }

            if (field == "mediaitem") {
                var sublist = context.sublstId;
                var line = context.line;
                dialog.alert({
                    title: "File Attached  in :",
                    message: "Media Item :" + context.currentRecord.getValue("mediaitem") + " + Sublist : " + sublist + " + line :" + line
                })
                var mediaitem = currentRecord.getValue("mediaitem");
                if (mediaitem != "" || mediaitem != " " || mediaitem != null || mediaitem != undefined || mediaitem <= 0) {
                    currentRecord.setValue({
                        fieldId: "custrecord_lms_supporting_document",
                        value: true
                    })
                    dialog.alert({
                        title: "File Attached ",
                        message: "You have submitted a file for this leave record type"
                    })
                } else {
                    currentRecord.setValue({
                        fieldId: "custrecord_lms_supporting_document",
                        value: false
                    })

                    dialog.alert({
                        title: "File Not Attached ",
                        message: "You have not submitted a file for this leave record type"
                    })
                }




            }
        } catch (e) {
            log.error(e.message);
        }
    }

    function saveRecord(context) {
        var record = context.currentRecord
        var leavebalance = record.getValue("custrecord_lms_leave_balance");
        var noofdays = record.getValue("custrecord_lms_number_of_days");
        var mediaitem = record.getValue("mediaitem");
        var leaveType = record.getValue("custrecord_lms_leave_type");
        // var toDate=record.getValue("custrecord_lms_to_date");
        // var fromDate=record.getValue("custrecord_lms_number_of_days");
        if (leavebalance - noofdays < 0) {
            alert("Check balance and leave day value properly:you dont have balance");
            return false;
        }
        var checkBox = record.getValue("custrecord_lms_supporting_document");
        var leaveType = record.getValue("custrecord_lms_leave_type");
        //var fieldChanged = record.getValue("custrecord_lms_leave_type");

        if (leaveType == 9 || leaveType == 11 || leaveType == 2 || leaveType == 3) {

            if (checkBox == false) {
                alert("Please select file for this leave type");
                return false;
            }
        }
        blankResult = (validity(leaveType) &&
            validity(noofdays) &&
            validity(leavebalance));
        /*alert("leave Type" + " : " + leaveType + " : noofdays" + " : " + noofdays + ": leave balance" + " : " + leavebalance + "Check balance and leave day value properly : blankresult : " + blankResult);*/
        if (noofdays == "" || noofdays == " ") {
            alert("Please Provide appropriate from date and to date to calculate no of days to save leave record")
            return false;
        }
        if (mediaitem == "" || mediaitem == " ") {
            alert("Please Provide appropriate file to save leave record")
            currentRecord.setValue({
                fieldId: "custrecord_lms_supporting_document",
                value: false
            })
            return false;
        }

        function validity(data) {
            if (data == "" || data == " " || data == null || data == undefined || data <= 0 || data === " ") {
                return true;
            } else {
                return false;
            }
        }
        if (blankResult == true) {
            alert("Please Provide appropriate details to save leave record")
            return false;
        } else {
            return true;
        }

    }

    return {
        fieldChanged: fieldChange,
        saveRecord: saveRecord
    }
});