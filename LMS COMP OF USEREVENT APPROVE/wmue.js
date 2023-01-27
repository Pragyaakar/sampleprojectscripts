/** 
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
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

        function afterSubmit(scriptContext) {
            try {

                if (scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.EDIT || scriptContext.type == 'view') {
                    var obj_record = scriptContext.newRecord;
                    var i_recordId = scriptContext.newRecord.id;
                    var s_record_type = scriptContext.newRecord.type;
                    var currentrecord = scriptContext.currentRecord;
                    //  var currentuser = runtime.getCurrentUser();
                    log.debug('s_record_type', s_record_type);
                    log.debug('i_recordId', i_recordId);
                    log.debug('obj_record ', obj_record);
                    log.debug('currentrecord ', currentrecord);
                    var userobj = runtime.getCurrentUser();
                    log.debug("userobj", userobj);
                    var author = userobj.id;
                    log.debug("author", author);

                    var custName = obj_record.getValue({
                        fieldId: 'entity',

                    });
                    var custText = obj_record.getText({
                        fieldId: 'entity',

                    });
                    log.debug('custName', custName);
                    log.debug('custText ', custText);

                    var enable_val = obj_record.getValue({
                        fieldId: 'custbody21',

                    });
                    var ph = obj_record.getValue({
                        fieldId: 'custbody15',

                    });
                    var custEmail = obj_record.getValue({
                        fieldId: 'custbody14',

                    });
                    var documentNumber = obj_record.getValue({
                        fieldId: 'tranid',

                    });
                    log.debug('documentNumber', documentNumber);
                    log.debug('custEmail ', custEmail);
                    log.debug('enable_val', enable_val);
                    log.debug('ph ', ph);


                    if (enable_val) {
                        var wiRec = record.load({
                            type: 'customrecord516',
                            id: 20,
                            isDynamic: true
                        });
                        log.debug("wiRec", wiRec);
                        var wirec_name = wiRec.getValue({
                            fieldId: 'custrecord1408'
                        });
                        if (wirec_name == true) {

                            var enable_name = s_record_type;

                        } else {
                            var enable_name = '';
                        }
                        log.debug('enable_name', enable_name);
                        var wirec_date = wiRec.getValue({
                            fieldId: 'custrecord1410'
                        });
                        if (wirec_date == true) {
                            var enable_date = obj_record.getValue({
                                fieldId: 'trandate',

                            });

                        } else {
                            var enable_date = '';

                        }
                        log.debug('enable_date', enable_date);
                        var wirec_cls = wiRec.getValue({
                            fieldId: 'custrecord1416'
                        });
                        if (wirec_cls == true) {
                            var enable_cls = obj_record.getValue({
                                fieldId: 'custbody21',

                            });

                        } else {
                            var enable_cls = '';

                        }
                        log.debug('enable_cls', enable_cls);
                        var wirec_dcreated = wiRec.getValue({
                            fieldId: 'custrecord1409'
                        });
                        if (wirec_dcreated == true) {
                            var enable_dcreated = obj_record.getValue({
                                fieldId: 'custbody21',

                            });

                        } else {
                            var enable_dcreated = '';

                        }
                        log.debug('enable_dcreated', enable_dcreated);
                        var wirec_satt = wiRec.getValue({
                            fieldId: 'custrecord1417'
                        });
                        if (wirec_satt == true) {
                            var enable_satt = obj_record.getValue({
                                fieldId: 'custbody21',

                            });

                        } else {
                            var enable_satt = '';

                        }
                        log.debug('enable_satt', enable_satt);
                        var wirec_createdby = wiRec.getValue({
                            fieldId: 'custrecord1411'
                        });
                        if (wirec_createdby == true) {
                            var enable_createdby = obj_record.getValue({
                                fieldId: 'custbody21',

                            });

                        } else {
                            var enable_createdby = '';

                        }
                        log.debug('enable_createdby', enable_createdby);
                        var wirec_tamount = wiRec.getValue({
                            fieldId: 'custrecord1412'
                        });
                        if (wirec_tamount == true) {
                            var enable_tmount = obj_record.getValue({
                                fieldId: 'total',

                            });

                        } else {
                            var enable_tmount = '';

                        }
                        log.debug('enable_tmount', enable_tmount);
                        var wirec_subs = wiRec.getValue({
                            fieldId: 'custrecord1413'
                        });
                        if (wirec_subs == true) {
                            var enable_subs = obj_record.getText({
                                fieldId: 'subsidiary',

                            });

                        } else {
                            var enable_subs = '';

                        }
                        log.debug('enable_subs', enable_subs);
                        var wirec_loc = wiRec.getValue({
                            fieldId: 'custrecord1414'
                        });
                        if (wirec_loc == true) {
                            var enable_loc = obj_record.getText({
                                fieldId: 'location',

                            });

                        } else {
                            var enable_loc = '';

                        }
                        log.debug('enable_loc', enable_loc);
                        var wirec_dept = wiRec.getValue({
                            fieldId: 'custrecord1415'
                        });
                        if (wirec_dept == true) {
                            var enable_dept = obj_record.getText({
                                fieldId: 'department',

                            });

                        } else {
                            var enable_dept = '';

                        }
                        log.debug('enable_dept', enable_dept);
                        // log.debug('cust',cust);
                        // log.debug('enable_cust',enable_cust);


                        var html = '<html>';

                        html += '<head><style>table {border-collapse: collapse;border: 1px solid black;} th, td {border: 1px solid black;padding: 8px;}</style></head>';

                        html += '<body>Hi ' + custText + '<br/><br/>(' + ph + ')' + ',<br/><br/>SO - ' + documentNumber + ' has been created.<br/><br/>';
                        if (isNotEmpty(enable_name)) {
                            html += '<br/><br/>Transaction Name-' + enable_name + '-' + documentNumber + '<br/><br/>';
                        }
                        if (isNotEmpty(enable_createdby)) {
                            html += '<br/><br/>Date Created-' + enable_createdby + '<br/><br/>';
                        }
                        if (isNotEmpty(enable_date)) {
                            html += '<br/><br/>Date-' + enable_date + '<br/><br/>';
                        }
                        if (isNotEmpty(enable_createdby)) {
                            html += '<br/><br/>Created By-' + enable_createdby + '<br/><br/>';
                        }
                        if (isNotEmpty(enable_tmount)) {
                            html += '<br/><br/>Total Amount-' + enable_tmount + '<br/><br/>';
                        }
                        if (isNotEmpty(enable_subs)) {
                            html += '<br/><br/>Subsidiary-' + enable_subs + '<br/><br/>';
                        }
                        if (isNotEmpty(enable_loc)) {
                            html += '<br/><br/>Location-' + enable_loc + '<br/><br/>';
                        }
                        if (isNotEmpty(enable_dept)) {
                            html += '<br/><br/>Department-' + enable_dept + '<br/><br/>';
                        }
                        if (isNotEmpty(enable_cls)) {
                            html += '<br/><br/>Class-' + enable_cls + '<br/><br/>';
                        }
                        if (isNotEmpty(enable_satt)) {
                            html += '<br/><br/>Send Attachment-' + enable_satt + '<br/><br/>';
                        }
                        html += '<br/><br/>Thanks.</body></html>';
                        email.send({
                            author: author,
                            recipients: custEmail,
                            subject: 'SO - ' + documentNumber + 'Created.',
                            body: html,

                        });
                        log.debug('Email sent', 'document Number - ' + documentNumber);

                    }

                } //end of if(scriptContext.type == 'view')


            } //end of try block
            catch (e) {
                log.debug('Exception:==', e);
            } //end of catch block	
        } //end of function beforeLoad(scriptContext) 



        return {
            afterSubmit: afterSubmit


        };
    });

function isNotEmpty(value) {
    if (value != null && value != 'undefined' && value != undefined && value != '' && value != NaN && value != 'NaN' && value != '- None -')
        return true;
    else
        return false;
} //