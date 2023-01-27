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

        function beforeLoad(scriptContext) {
            try {

                if (scriptContext.type == 'create') {
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
                    var current_user_id = userobj.id;
                    log.debug("current_user_id", current_user_id);
                    var wiRec = record.load({
                        type: 'customrecord516',
                        id: 20,
                        isDynamic: true
                    });
                    log.debug("wiRec", wiRec);
                    var cust = wiRec.getValue({
                        fieldId: 'custrecord1424'
                    });
                    var enable_cust = wiRec.getValue({
                        fieldId: 'custrecord1404'
                    });
                    log.debug('cust', cust);
                    log.debug('enable_cust', enable_cust);
                    if (enable_cust == true && cust == true) {


                        obj_record.setValue({
                            fieldId: 'custentity24',
                            value: true,
                            ignoreFieldChange: true
                        });

                    }
                } //end of if(scriptContext.type == 'view')


            } //end of try block
            catch (e) {
                log.debug('Exception:==', e);
            } //end of catch block	
        } //end of function beforeLoad(scriptContext) 



        return {
            beforeLoad: beforeLoad,


        };
    });