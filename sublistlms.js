/**
 * @NApiVersion 2.x
 * @NScriptType clientscript
 */
define(['N/record', 'N/ui/dialog'], function (record, dialog) {
    function init(c) {
        if (c.mode == 'create') {
            return;
        }
        var rec = c.currentRecord;
        rec.setSublistValue({
            sublistId: 'customrecord_lms_employee_leave',
            fieldId: 'subsidiary',
            line: 0,
            value: 1
        });


    }
    return {
        pageInit: init
    }
});