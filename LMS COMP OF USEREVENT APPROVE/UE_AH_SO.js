/** 
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 *@Author Aakanksha
 *@date 16/01/23
 */

define(['N/currentRecord', 'N/email', 'N/error', 'N/format', 'N/http', 'N/log', 'N/record', 'N/runtime', 'N/search', 'N/transaction', 'N/translation', 'N/ui/dialog', 'N/ui/message', 'N/ui/serverWidget', 'N/url'],
    /**
     * @param {currentRecord} currentRecord
     * @param {email} email
     * @param {error} error
     * @param {format} format
     * @param {http} http
     * @param {log} log
     * @param {record} record
     * @param {runtime} runtime
     * @param {search} search
     * @param {transaction} transaction
     * @param {translation} translation
     * @param {dialog} dialog
     * @param {message} message
     * @param {serverWidget} serverWidget
     * @param {url} url
     */
    function (currentRecord, email, error, format, http, log, record, runtime, search, transaction, translation, dialog, message, serverWidget, url) {

        function beforeLoad(scriptContext) {
            try {
                // this is code used to set the value of created by,rejected by,approval status etc in make copy mode
                if (scriptContext.type == 'copy') {
                    var obj_record = scriptContext.newRecord;
                    var user = runtime.getCurrentUser();
                    var author = user.id;
                    var approval_status = obj_record.getValue('custbody_ah_approval_status');
                    var lastApprove_by = obj_record.getField('custbody_ah_last_approved_by');
                    var rejected_by = obj_record.getField('custbody_ah_rejected_by');

                    obj_record.setValue({
                        fieldId: 'custbody_ah_cl_created_by',
                        value: author
                    });
                    obj_record.setValue({
                        fieldId: 'custbody_ah_approval_status',
                        value: 3
                    });
                    obj_record.setValue({
                        fieldId: 'custbody_rejreason',
                        value: ''
                    });
                    obj_record.setValue({
                        fieldId: 'custbody23',
                        value: ''
                    });
                    if (lastApprove_by) {
                        obj_record.setValue({
                            fieldId: 'custbody_ah_last_approved_by',
                            value: ''
                        });
                    }
                    if (rejected_by) {
                        obj_record.setValue({
                            fieldId: 'custbody_ah_rejected_by',
                            value: ''
                        });
                    }
                }
                if (scriptContext.type == 'create') {
                    var obj_record = scriptContext.newRecord;
                    var i_recordId = scriptContext.newRecord.id;
                    var s_record_type = scriptContext.newRecord.type;
                    var approval_status = obj_record.getValue('custbody_ah_approval_status');
                    log.debug('approval_status', approval_status);
                    obj_record.setValue({
                        fieldId: 'custbody_ah_approval_status',
                        value: 3
                    });
                    var user = runtime.getCurrentUser();
                    var author = user.id; //custbody_ah_cl_created_by
                    obj_record.setValue({
                        fieldId: 'custbody_ah_cl_created_by',
                        value: author
                    });
                }

                // for view mode
                if (scriptContext.type == 'view') {
                    var obj_record = scriptContext.newRecord;
                    var i_recordId = scriptContext.newRecord.id;
                    var s_record_type = scriptContext.newRecord.type;
                    var currentrecord = scriptContext.currentRecord;
                    log.debug('s_record_type', s_record_type);
                    log.debug('i_recordId', i_recordId);
                    var userobj = runtime.getCurrentUser();
                    log.debug("userobj", userobj);
                    var current_user_id = userobj.id;
                    log.debug("current_user_id", current_user_id);
                    var next_approver = obj_record.getValue('custbody_ah_next_approver');
                    log.debug('next_approver', next_approver);
                    var approval_status = obj_record.getValue('custbody_ah_approval_status');
                    log.debug('approval_status', approval_status);
                    var created_by = obj_record.getValue('custbody_ah_cl_created_by');
                    log.debug('created_by', created_by);

                    // submit for approval 
                    if (approval_status == 3) {
                        log.debug('approval_status', approval_status);
                        scriptContext.form.clientScriptModulePath = './ApproveButtonClientScript.js';

                        scriptContext.form.addButton({
                            id: "custpage_subapprove",
                            label: "Submit For Approval",
                            functionName: "onSubmitForApproval"
                        });
                    } //end of if condition

                    if ((isNotEmpty(next_approver) && (next_approver == current_user_id) && ((approval_status == 6) || ((approval_status == 4))))) {
                        scriptContext.form.clientScriptModulePath = './ApproveButtonClientScript.js';
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

                    if ((approval_status == 5) && (created_by == current_user_id)) {
                        scriptContext.form.clientScriptModulePath = './ApproveButtonClientScript.js';
                        scriptContext.form.addButton({
                            id: "custpage_resubmit",
                            label: "Resubmit",
                            functionName: "onResubmitButtonClick"
                        });
                    }
                } //end of if(scriptContext.type == 'view')
            } //end of try block
            catch (e) {
                log.debug('Exception:==', e);
            } //end of catch block	
        } //end of function beforeLoad(scriptContext) 

        function beforeSubmit(scriptContext) {
            try {
                log.debug('runtime.executionContext', runtime.executionContext);
                log.debug('scriptContext.type', scriptContext.type);


            } catch (err) {
                log.error('Error occurred in beforeload function', err);
            }
        }

        function afterSubmit(scriptContext) {
            try {
                log.debug('scriptContext.type', scriptContext.type);
                var newRecord = scriptContext.newRecord;
                var poRec = record.load({
                    type: newRecord.type,
                    id: newRecord.id
                });
                log.debug(" poRec", poRec);
                var obj_record = scriptContext.newRecord;
                var i_recordId = scriptContext.newRecord.id;
                var s_record_type = scriptContext.newRecord.type;
                var currentrecord = scriptContext.currentRecord;
                var user = runtime.getCurrentUser();
                log.debug("user", user);
            } catch (err) {
                log.error('Error occurred in beforeload function', err);
            }
        }

        return {
            beforeLoad: beforeLoad,
            beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit
        };
    });

function isNotEmpty(value) {
    if (value != null && value != 'undefined' && value != undefined && value != '' && value != NaN && value != 'NaN' && value != '- None -')
        return true;
    else
        return false;
} //