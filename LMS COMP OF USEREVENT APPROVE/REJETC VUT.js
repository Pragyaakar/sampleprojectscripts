/**

* @NApiVersion 2.x

* @NScriptType UserEventScript

* @NModuleScope Public

*Name       : Comp Off Approve Button

*Purpose    : To show approval button for employees and approve/reject button for Supervisor

*Created On : 11-jan-2023

*Author     : BINOD KAMAT

*Script Type : UserEventScript

*Version    : 2.0

*

*/

define(['N/email', 'N/log', 'N/record', 'N/runtime', 'N/search', 'N/email'],

    function (email, log, record, runtime, search, email) {

        function beforeLoad(scriptContext) {
            try {



                if (scriptContext.type == 'create') {
                    var obj_record = scriptContext.newRecord;
                    var i_recordId = scriptContext.newRecord.id;
                    var s_record_type = scriptContext.newRecord.type;
                    var userRole = runtime.getCurrentUser().role;
                    var status = obj_record.getValue("custrecord_lms_request_status");
                    /*	Pending Approval	3	 
                        Approved	 	4	 
                        Rejected	 	5	 
                        Submitted for Approval	 	6*/
                    obj_record.setValue({
                        fieldId: 'custrecord_lms_request_status',
                        value: 6

                    });
                    if (status == 3) {
                        obj_record.setValue({
                            fieldId: 'custrecord1475',
                            value: new Date()

                        });
                    }


                }


                if (scriptContext.type == 'view') {
                    var userRole = runtime.getCurrentUser().role;
                    var obj_record = scriptContext.newRecord;
                    var userobj = runtime.getCurrentUser();
                    var current_user_id = userobj.id;
                    var leaveRequestor = obj_record.getValue('custrecord_lms_employee_');
                    var sup_approver = obj_record.getValue('custrecord1472');
                    var approval_status = obj_record.getValue('custrecord_lms_request_status');
                    //  if (approval_status == 6 && (leaveRequestor == current_user_id || current_user_role == 3))
                    if (approval_status == 6 && (leaveRequestor == current_user_id || userRole == 3 || userRole == 15)) {
                        scriptContext.form.clientScriptModulePath = './LMS_CompOFF_CLButton.js';
                        scriptContext.form.addButton({
                            id: "custpage_subapprove",
                            label: "Submit For Approval",
                            functionName: "onSubmitForApproval"
                        });
                    };

                    if (approval_status == 3 && isNotEmpty(sup_approver) && (sup_approver == current_user_id || userRole == 3 || userRole == 15)) {


                        scriptContext.form.clientScriptModulePath = './LMS_CompOFF_CLButton.js';
                        if (approval_status == 3) {
                            obj_record.setValue({
                                fieldId: 'custrecord1475',
                                value: new Date()

                            });
                        }
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

                    }
                }


            } //end of try block
            catch (e) {
                log.error(e.name, e.message);
            } //end of catch block	
        } //end of function beforeLoad(scriptContext) 

        function afterSubmit(scriptContext) {
            try {
                //email sending code from line 86 to line 136
                var newRecord = scriptContext.newRecord;
                var status = newRecord.getValue("custrecord_lms_request_status");
                var emp = newRecord.getValue("custrecord_lms_employee_");
                var fieldLookUpE = search.lookupFields({
                    type: search.Type.EMPLOYEE,
                    id: emp,
                    columns: ['firstname']
                });
                log.debug("look up ", fieldLookUpE)
                var empname = fieldLookUpE['firstname'];

                var supApprover = newRecord.getValue("custrecord1472");
                var fieldLookUpS = search.lookupFields({
                    type: search.Type.EMPLOYEE,
                    id: supApprover,
                    columns: ['firstname']
                });
                var supApproverN = fieldLookUpS['firstname'];
                var compoff_reason = newRecord.getValue("custrecord_compoff_reason");
                var from_date = newRecord.getValue("custrecord_comp_off_date");
                var rej_reason = newRecord.getValue("custrecord1473");
                var to_date = newRecord.getValue("custrecord_comp_off_date_to");
                var urlr = "https://tstdrv2648267.app.netsuite.com/app/common/custom/custrecordentry.nl?id=" + newRecord.id + "&rectype=541&whence=";
                log.debug("debug", newRecord.request);
                //submit for Approval 6
                if (status == 6) {

                    var authorId = supApprover;
                    var recipientEmail = emp;
                    subject = "Pending for Submit Comp Of";
                    body = "Hi&nbsp;&nbsp;" + empname + ',<br></br>&nbsp;&nbsp;&nbsp;&nbsp;Your Comp Of is <span style="color:green;display: inline">pending for submit approval </span> from your Supervisor.You can submit for appoval now .<a href=' + urlr + '> Click here </a>to submit it.'
                }
                //pending approval 3
                if (status == 3) {
                    var authorId = emp;
                    var recipientEmail = supApprover;
                    subject = "Pending for approve my Comp Of";
                    body = "Hi &nbsp;&nbsp;" + supApproverN + ',<br></br>&nbsp;&nbsp;&nbsp;&nbsp;I have applied Comp Of with date range : <span style="color:red;display: inline"> ' + from_date + ' to ' + to_date + '</span>it is  <span style="color:green;display: inline">pending  for approval </span> from your side .You can approve from  .<a href=' + urlr + '> Click here </a> now.,<hr> <span style="color:red;display: inline">Reason : </span> <span style="color:red;display: inline"> ' + compoff_reason + '</span>'
                }
                //approved 4
                /* if (status == 4) {
                     log.debug(scriptContext.newRecord["type"],scriptContext.newRecord["id"]);
                     var rComp=(record.load({type:scriptContext.newRecord["type"],id:scriptContext.newRecord["id"]}));
                     rComp.setValue("custrecord1475",new Date());
                     rComp.save();
                 }
     */
                if (status == 4) {
                    var authorId = newRecord.getValue("custrecord1472");
                    var recipientEmail = emp;
                    subject = "Approved  Comp Of";
                    body = "Hi &nbsp;&nbsp;" + empname + ',<br></br>&nbsp;&nbsp;&nbsp;&nbsp;your Comp Of with date range : <span style="color:red;display: inline"> ' + from_date + ' to ' + to_date + '</span> is  <span style="color:green;display: inline">Approved </span>  .You can see status  .<a href=' + urlr + '> Click here </a>.,<hr> <span style="color:red;display: inline"> Comp Of Reason : </span> <span style="color:red;display: inline"> ' + compoff_reason + '</span>'


                    var compOff = scriptContext.newRecord;



                    var empName = empname;
                    var compOffHours = compOff.getValue('custrecord_lms_total_hours');
                    var totalDays = 0;
                    while (compOffHours >= 1) {
                        if (compOffHours >= 9) {
                            compOffHours = compOffHours - 9;
                            totalDays = totalDays + 1;
                        } else if (compOffHours >= 8) {
                            compOffHours = compOffHours - 8;
                            totalDays = totalDays + 1;
                        } else if (compOffHours >= 7) {
                            compOffHours = compOffHours - 7;
                            totalDays = totalDays + 1;
                        } else if (compOffHours >= 6) {
                            compOffHours = compOffHours - 6;
                            totalDays = totalDays + 1;
                        } else {
                            compOffHours = compOffHours - compOffHours;
                            totalDays = totalDays + 0.5;
                        }

                    };

                    try {
                        var leaveSearch = search.create({
                            type: "customrecord_lms_employee_leave",
                            filters: [
                                ["custrecord_lms_parent_record", search.Operator.ANYOF, [emp]],
                                'and',
                                ["custrecord_lms_leave_type_1", search.Operator.ANYOF, [5]]
                            ],
                            columns: ["custrecord_leave_balance_lms"]
                        });
                        var leaveBalance = leaveSearch.run().getRange({
                            start: 0,
                            end: 1
                        });
                        var id = leaveBalance[0]["id"];
                        var leaveBalancerecord = record.load({
                            type: "customrecord_lms_employee_leave",
                            id: id
                        });
                        var leavebalances = leaveBalancerecord.getValue("custrecord_leave_balance_lms");
                        log.debug({
                            title: 'Old leave balances : ',
                            details: leavebalances
                        });
                        if (Number(totalDays) >= 0) {
                            leaveBalancerecord.setValue({
                                fieldId: 'custrecord_leave_balance_lms',
                                value: (leavebalances + totalDays)
                            });
                        }
                        log.debug({
                            title: 'Old leave balances : ' + leavebalances,
                            details: 'New leave balances : ' + leavebalances + totalDays
                        });
                        saved = leaveBalancerecord.save();

                    } catch (e) {
                        log.error("Approved Error", e.name + "<--=-->" + e.message)
                    }
                }
                //reject 5
                if (status == 5) {
                    var authorId = newRecord.getValue("custrecord1472");
                    var recipientEmail = emp;
                    subject = "Rejected  Comp Of";
                    body = "Hi &nbsp;&nbsp;" + empname + ',<br></br>&nbsp;&nbsp;&nbsp;&nbsp;your Comp Of with date range : <span style="color:red;display: inline"> ' + from_date + ' to ' + to_date + '</span> is  <span style="color:red;display: inline">Rejected </span>  .You can see status  .<a href=' + urlr + '> Click here </a> .,<hr> <span style="color:red;display: inline">Reason : </span> <span style="color:tomato;display: inline"> ' + compoff_reason + '</span> <span style="color:red;display: inline"> Rjection Reason : </span> <span style="tomato:red;display: inline"> ' + rej_reason + '</span>'

                }
                email.send({
                    author: authorId,
                    recipients: recipientEmail,
                    subject: subject,
                    body: body
                });
                //email send ends




            } catch (e) {
                log.debug(e.name, e.message);
            } //end of catch block	
        } //end of function afterSubmit(scriptContext) 




        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit

        };
    });

function isNotEmpty(value) {
    if (value != null && value != 'undefined' && value != undefined && value != '' && value != NaN && value != 'NaN' && value != '- None -')
        return true;
    else
        return false;
}