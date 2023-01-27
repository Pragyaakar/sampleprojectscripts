/**
 *@NApiVersion 2.0
 *@NScriptType ScheduledScript
 */
define(['N/search', 'N/record', 'N/email', 'N/runtime'],
    function (search, record, email, runtime) {
        function execute(context) {
            log.debug("Execute");
            //load the bill

            var objScript = runtime.getCurrentScript();
            try {
                var arrayVals = objScript.getParameter({
                    name: "custscript_array_list"
                });
                var oprater = objScript.getParameter({
                    name: "custscript_operation"
                });
                log.debug("operator", oprater)
                //log.debug("arrayVals", arrayVals);
                //log.debug("arrayVals",arrayVals.length);
                var arrresult = JSON.parse(arrayVals);
                // log.debug("arrresult", arrresult);
                // log.debug("arrresult.length", arrresult.length);
                for (var i = 0; i < arrresult.length; i++) {
                    log.debug("Id : ", arrresult[i]);
                    ids = arrresult[i];
                    var rec = record.load({
                        type: "customrecord_lms_leave_entry",
                        id: ids,
                        isDynamic: true
                    })
                    leaveType = rec.getValue("custrecord_lms_leave_type");
                    if (leaveType) {
                        rec.setValue({
                            fieldId: "custrecord_lms_leave_type",
                            value: leaveType
                        });

                    } else {
                        rec.setValue({
                            fieldId: "custrecord_lms_leave_type",
                            value: 2
                        });
                    }
                    // log.debug('leave type valued :', "Done");

                    rec.setValue({
                        fieldId: "custrecord_lms_leave_reasons",
                        value: "This field is set by script to test bulk approval by suitelet page" + new Date()
                    });
                    //log.debug('leave Reason valued :', "Done");
                    rec.save();
                }
                log.debug('leave saved :', "saved all Done");
            } catch (e) {
                log.error(e.name + "--" + e.message)
            }

        }

        return {
            execute: execute
        };
    });