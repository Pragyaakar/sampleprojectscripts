/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope Public
 *
 *Name       : Commp Off Test
 *Purpose    : The user can apply comp off, which will be credited to the employee's comp off balance
 *Created On : 27-Dec-2022
 *Author     : Binod Kamat
 *Script Type : UserEventScript
 *Version    : 2.0
 *
 */

define(['N/record', 'N/search'], function (record, search) {
    function afterSubmit(context) {
        if (context.type !== context.UserEventType.CREATE) {
            return;
        }

        var compOff = context.newRecord;
        var empName = compOff.getValue('custrecord_lms_employee_');
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
                    ["custrecord_lms_parent_record", search.Operator.ANYOF, [empName]],
                    'and',
                    ["custrecord_lms_leave_type_1", search.Operator.ANYOF, [5]]
                ],
                columns: ["custrecord_leave_balance_lms"]
            });
            var leaveBalance = leaveSearch.run().getRange({
                start: 0,
                end: 1
            });
            log.debug({
                title: 'filtered Result : ',
                details: leaveBalance
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
                title: 'New leave balances : ',
                details: leavebalances + totalDays
            });
            saved = leaveBalancerecord.save();
            log.debug({
                title: 'leave balance  Id: ',
                details: saved
            });
        } catch (e) {
            log.error(e.name + "<--=-->" + e.message)
        }
    }
    return {
        afterSubmit: afterSubmit
    }
})