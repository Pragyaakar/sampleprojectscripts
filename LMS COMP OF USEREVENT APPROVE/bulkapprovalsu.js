/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
 */

define(['N/ui/serverWidget', 'N/search', 'N/record', 'N/runtime', 'N/redirect', 'N/task', 'N/url'],
    function (uiS, search, record, runtime, redirect, task, url) {
        function onRequest(context) {
            var request = context.request;
            var response = context.response;
            var ScriptObj = runtime.getCurrentScript();
            try {

                if (context.request.method === 'GET') {

                    var form = uiS.createForm({
                        title: 'Approve / Reject Leave Entry Record  '
                    });
                    form.clientScriptFileId = 5908;
                    form.addSubmitButton({
                        label: 'Submit '
                    });

                    form.addButton({
                        label: 'Approve ',
                        id: "approve" //functionName :--
                    });
                    form.addButton({
                        label: 'Reject',
                        id: "reject"
                    });
                    var fieldgroup = form.addFieldGroup({
                        id: 'fieldgroupid',
                        label: ' Filter Base On'
                    });
                    var tran = form.addField({
                        id: 'custpage_employee',
                        type: uiS.FieldType.SELECT,
                        label: 'Employee',
                        source: 'employee',
                        container: 'fieldgroupid'
                    });

                    var status = form.addField({
                        id: 'custpage_status',
                        type: uiS.FieldType.SELECT,
                        label: 'Status',
                        source: 'salesorder', //'customlist_approvalstatus',
                        container: 'fieldgroupid'
                    });
                    var fromDate = form.addField({
                        id: 'custpage_from',
                        type: uiS.FieldType.DATE,
                        label: ' FROM DATE',
                        container: 'fieldgroupid'
                    })
                    var noofdays = form.addField({
                        id: 'custpage_days',
                        type: uiS.FieldType.TEXT,
                        label: ' NO. OF LEAVE DAYS APPLIED (MORE THAN EQUAL TO)',
                        container: 'fieldgroupid'
                    })
                    var toDate = form.addField({
                        id: 'custpage_to',
                        type: uiS.FieldType.DATE,
                        label: ' TO DATE',
                        container: 'fieldgroupid'
                    })

                    var noOfDays = context.request.parameters["custscript_no_of_days"];
                    var employee = context.request.parameters["custscript_employee"];
                    var employee = context.request.parameters["custscript_employee"];
                    if (noOfDays) {
                        noofdays.defaultValue = noOfDays;
                    }
                    if (employee) {
                        tran.defaultValue = employee;
                    }
                    var sublist = form.addSublist({
                        id: 'sublist',
                        type: uiS.SublistType.LIST,
                        label: 'Leave Entry Records : '
                    });
                    sublist.addMarkAllButtons();

                    sublist.addField({
                        id: 'custpage_apply',
                        type: uiS.FieldType.CHECKBOX,
                        label: 'Apply'
                    });
                    sublist.addField({
                        id: 'custpage_id',
                        type: uiS.FieldType.TEXT,
                        label: 'INTERNAL ID'
                    });
                    sublist.addField({
                        id: 'custpage_entity',
                        type: uiS.FieldType.TEXT,
                        label: 'EMPLOYEE NAME'
                    });
                    sublist.addField({
                        id: 'custpage_from',
                        type: uiS.FieldType.TEXT,
                        label: 'FROM DATE'
                    });
                    sublist.addField({
                        id: 'custpage_to',
                        type: uiS.FieldType.TEXT,
                        label: 'TO DATE'
                    });
                    sublist.addField({
                        id: 'custpage_type',
                        type: uiS.FieldType.TEXT,
                        label: 'LEAVE TYPE'
                    });
                    sublist.addField({
                        id: 'custpage_days',
                        type: uiS.FieldType.TEXT,
                        label: 'LEAVE APPLIED NO OF DAYS'
                    });
                    sublist.addField({
                        id: 'custpage_arstatus',
                        type: uiS.FieldType.TEXT,
                        label: 'Status ( After Submit )'
                    });

                    if (employee) {
                        function isNotEmpty(value) {
                            if (value != null && value != 'undefined' && value != undefined && value != '' && value != NaN && value != 'NaN' && value != '- None -')
                                return true;
                            else
                                return false;
                        }
                        var NotEmpty = isNotEmpty(noOfDays);
                        if (!NotEmpty) {
                            noOfDays = 0;
                        }


                        var leaveSearch = search.create({
                            type: "customrecord_lms_leave_entry",
                            filters: [

                                ["custrecord_lms_employee", "IS", employee],
                                "AND",
                                ["custrecord_lms_number_of_days", "GREATERTHANOREQUALTO", noOfDays]
                            ],
                            columns: [
                                'custrecord_lms_employee',
                                'custrecord_lms_leave_type',
                                'custrecord_lms_from_date',
                                'custrecord_lms_to_date',
                                'custrecord_lms_number_of_days',
                                'custrecord_lms_approver_name',
                                'custrecord_lms_employee_supervisor'

                            ],
                            id: "customsearch_my"
                        });
                        var j = 0;

                        var myResultSet = leaveSearch.run();
                        var resultRange = myResultSet.getRange({
                            start: 0,
                            end: 50
                        })
                        for (var i = 0; i < resultRange.length; i++) {

                            var result = resultRange[i]
                            employee = result.getText({
                                name: 'custrecord_lms_employee'
                            });
                            leaveType = result.getText({
                                name: 'custrecord_lms_leave_type'
                            });
                            fromDate = result.getValue({
                                name: 'custrecord_lms_from_date'
                            });
                            toDate = result.getValue({
                                name: 'custrecord_lms_to_date'
                            });
                            leavenoofdays = result.getValue({
                                name: 'custrecord_lms_number_of_days'
                            });
                            supervisor = result.getValue({
                                name: 'custrecord_lms_employee_supervisor'
                            });
                            id = result['id'];
                            approver = result.getValue({
                                name: 'custrecord_lms_approver_name'
                            });


                            sublist.setSublistValue({
                                id: 'custpage_apply',
                                line: i,
                                value: 'F'
                            });

                            sublist.setSublistValue({
                                id: 'custpage_id',
                                line: i,
                                value: id
                            });

                            sublist.setSublistValue({
                                id: 'custpage_entity',
                                line: i,
                                value: employee
                            });

                            sublist.setSublistValue({
                                id: 'custpage_from',
                                line: i,
                                value: (new Date(fromDate)).toDateString()
                            });

                            sublist.setSublistValue({
                                id: 'custpage_to',
                                line: i,
                                value: (new Date(toDate)).toDateString()
                            });

                            sublist.setSublistValue({
                                id: 'custpage_type',
                                line: i,
                                value: " " + leaveType
                            });

                            sublist.setSublistValue({
                                id: 'custpage_days',
                                line: i,
                                value: leavenoofdays
                            });
                            sublist.setSublistValue({
                                id: 'custpage_arstatus',
                                line: i,
                                value: "To Approve"
                            });

                        }

                    } else {
                        function isNotEmpty(value) {
                            if (value != null && value != 'undefined' && value != undefined && value != '' && value != NaN && value != 'NaN' && value != '- None -')
                                return true;
                            else
                                return false;
                        }

                        var NotEmpty = isNotEmpty(context.request.parameters["custscript_no_of_days"]);
                        if (!NotEmpty) {
                            noOfDays = 0;
                        }


                        var leaveSearch = search.create({
                            type: "customrecord_lms_leave_entry",
                            filters: [
                                ["custrecord_lms_number_of_days", "GREATERTHANOREQUALTO", noOfDays]
                            ],
                            columns: [
                                'custrecord_lms_employee',
                                'custrecord_lms_leave_type',
                                'custrecord_lms_from_date',
                                'custrecord_lms_to_date',
                                'custrecord_lms_number_of_days',
                                'custrecord_lms_approver_name',
                                'custrecord_lms_employee_supervisor'

                            ],
                            id: "customsearch_my"
                        });
                        var j = 0;

                        var myResultSet = leaveSearch.run();
                        var resultRange = myResultSet.getRange({
                            start: 0,
                            end: 50
                        })
                        for (var i = 0; i < resultRange.length; i++) {

                            var result = resultRange[i]
                            employee = result.getText({
                                name: 'custrecord_lms_employee'
                            });
                            leaveType = result.getText({
                                name: 'custrecord_lms_leave_type'
                            });
                            fromDate = result.getValue({
                                name: 'custrecord_lms_from_date'
                            });
                            toDate = result.getValue({
                                name: 'custrecord_lms_to_date'
                            });
                            leavenoofdays = result.getValue({
                                name: 'custrecord_lms_number_of_days'
                            });
                            supervisor = result.getValue({
                                name: 'custrecord_lms_employee_supervisor'
                            });
                            id = result['id'];
                            approver = result.getValue({
                                name: 'custrecord_lms_approver_name'
                            });


                            sublist.setSublistValue({
                                id: 'custpage_apply',
                                line: i,
                                value: 'F'
                            });

                            sublist.setSublistValue({
                                id: 'custpage_id',
                                line: i,
                                value: id
                            });

                            sublist.setSublistValue({
                                id: 'custpage_entity',
                                line: i,
                                value: employee
                            });

                            sublist.setSublistValue({
                                id: 'custpage_from',
                                line: i,
                                value: (new Date(fromDate)).toDateString()
                            });

                            sublist.setSublistValue({
                                id: 'custpage_to',
                                line: i,
                                value: (new Date(toDate)).toDateString()
                            });

                            sublist.setSublistValue({
                                id: 'custpage_type',
                                line: i,
                                value: " " + leaveType
                            });

                            sublist.setSublistValue({
                                id: 'custpage_days',
                                line: i,
                                value: leavenoofdays
                            });

                            sublist.setSublistValue({
                                id: 'arcustpage_status',
                                line: i,
                                value: "To Approve"
                            });
                        }


                    }







                    /*
                                       var buttonA = form.addButton({
                                           id: 'approve',
                                           label: 'Approve',
                                           functionName: function approveFunction(form, context) {
                                               log.debug({
                                                   title: "Approve Button",
                                                   details: "Approved"
                                               })
                                           }
                                       });
                    
                    
                                       var buttonR = form.addButton({
                                           id: 'reject',
                                           label: 'Reject',
                                           functionName: function rejectFunction() {
                                               log.debug({
                                                   title: "Rejected button trigger :",
                                                   details: "Rejected"
                                               })
                                           }
                                       });*/
                    log.debug("Operation get value", form.getField("custpage_operation"));

                    var fieldgroup = form.addFieldGroup({
                        id: 'fieldgroupid2',
                        label: ' Performed Operation'
                    });
                    var tran = form.addField({
                        id: 'custpage_operation',
                        type: uiS.FieldType.SELECT,
                        label: 'Select Approve/Reject',
                        source: 'customlist_approve_reject',
                        container: 'fieldgroupid2'
                    });
                    context.response.writePage(form);




                } else {

                    log.audit('Inside the post method');
                    //var form =ui.createForm({ title: 'The Backend script is Processing to create a bill payment' });
                    //context.response.writePage(form);

                    var request = context.request;
                    var listCnt = request.getLineCount('sublist');
                    log.debug('listCnt', listCnt);
                    idSum = ""
                    re = 0;
                    var arrayList = new Array();
                    for (i = 0; i < listCnt; i++) {
                        var checkbox = request.getSublistValue({
                            'group': 'sublist',
                            'name': 'custpage_apply',
                            'line': i
                        });



                        if (checkbox == 'T') {
                            re++;
                            log.debug('checked chechbox :', ids);
                            var ids = request.getSublistValue({
                                'group': 'sublist',
                                'name': 'custpage_id',
                                'line': i
                            });
                            idSum += ids + " : "

                            var ars = request.getSublistValue({
                                'group': 'sublist',
                                'name': 'custpage_arstatus',
                                'line': i
                            });

                            log.debug('Id checkbox is checked :', ids);
                            /*  var rec = record.load({
                            type: "customrecord_lms_leave_entry",
                            id: ids,
                            isDynamic: true
                        })
                        rec.setValue({
                            fieldId: "custrecord_lms_leave_type",
                            value: rec.getValue("custrecord_lms_leave_type")
                        });
                        log.debug('type valued :', "Done");
                        rec.setValue({
                            fieldId: "custrecord_lms_leave_reasons",
                            value: rec.getValue("custrecord_lms_leave_type")
                        });
                        rec.setValue({
                            fieldId: "custrecord_lms_leave_reasons",
                            value: "This field is set by script to test bulk approval by suitelet page"
                        });
                        log.debug('Reason valued :', "Done");
                        rec.save();

*/
                            arrayList.push(ids);

                        }
                    }

                    function isNotEmpty(value) {
                        if (value != null && value != 'undefined' && value != undefined && value != '' && value != NaN && value != 'NaN' && value != '- None -')
                            return true;
                        else
                            return false;
                    }
                    var NotEmpty = isNotEmpty(idSum);
                    if (NotEmpty) {
                        var scheduledScriptTask = task.create({
                            taskType: task.TaskType.SCHEDULED_SCRIPT
                        });
                        scheduledScriptTask.scriptId = "customscript_schedulescript";
                        scheduledScriptTask.deploymentId = "customdeploy_schedulescript";
                        scheduledScriptTask.params = {
                            "custscript_array_list": arrayList,
                            "customscript_schedulescript": ars
                        };
                        var taskid = scheduledScriptTask.submit();
                        var form = uiS.createForm({
                            title: 'Total successfully Updated Records : ' + re + ' <hr> Ids Updated : ' + idSum + "<br> <hr>Test link : https://tstdrv2648267.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=509&id=" + idSum.split(":")[0]
                        });
                        log.debug({
                            title: "successful  check",
                            details: idSum
                        })
                        context.response.writePage(form);
                    } else {
                        var form = uiS.createForm({
                            title: "Select at least one record to update the record : <b> it seems you have not selected any record </b>"
                        });
                        form.addField
                        context.response.writePage(form);
                    }

                }

            } catch (e) {
                log.error(e.name + " : " + e.message);
            }


        }


        return {
            onRequest: onRequest
        };
    });