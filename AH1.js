/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * @author Aakanksha
 * @date 17/01/23
 */
define(['N/currentRecord'],
    function (currentRecord) {
        /**
         * Function to be executed after page is initialized.
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         * @since 2015.2
         */
        function pageInit(scriptContext) {
            // this code is used to unselect the value of multi-select field approvedBy,next approver in make copy mode
            if (scriptContext.mode == 'copy') {
                var obj_record = currentRecord.get();
                var approved_by = obj_record.getValue('custbody_ah_approved_by');
                var next_approver = obj_record.getField('custbody_ah_next_approver');

                if (approved_by) {
                    obj_record.setValue({
                        fieldId: 'custbody_ah_approved_by',
                        value: null
                    });
                }
                if (next_approver) {
                    obj_record.setValue({
                        fieldId: 'custbody_ah_next_approver',
                        value: null
                    });
                }
            }
        }
        return {
            pageInit: pageInit,
        };
    })