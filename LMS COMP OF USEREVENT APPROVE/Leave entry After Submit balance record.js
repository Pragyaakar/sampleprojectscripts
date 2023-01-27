/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope Public
 *
 *Name       : Leave entry After Submit balance record
 *Purpose    : When an employee applies for leave from the LMS Leave entry screen, the leave balance for that employee is updated
 *Created On : 08-Dec-2022
 *Author     : Binod Kamat
 *Script Type : UserEventScript
 *Version    : 2.0
 *
 */

define(['N/record', 'N/search'], function (record, search) {
    function afterSubmit(context) {
        var empRecord = context.newRecord;
        var emp1 = empRecord.getValue('custrecord_lms_employee');
        var status = empRecord.getValue('custrecord_lms_approval_status');
        var leaveType = empRecord.getValue('custrecord_lms_leave_type');
        if (context.type !== 'create') {

            //var leavebal = empRecord.getValue('custrecord_lms_leave_balance');


            log.debug({
                title: 'old ',
                details: " old edited "
            });

            var leaveDays = empRecord.getValue('custrecord_lms_number_of_days');
            try {
                log.debug(emp1, leaveType);
                var leaveSearch = search.create({
                    type: "customrecord_lms_employee_leave",
                    filters: [
                        ["custrecord_lms_parent_record", "ANYOF", [emp1]],
                        "AND",
                        ["custrecord_lms_leave_type_1", "ANYOF", [leaveType]]
                    ],
                    columns: ["custrecord_leave_balance_lms"]
                });
                var leaveBalance = leaveSearch.run().getRange({
                    start: 0,
                    end: 100
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
                    title: 'leavebalances : ',
                    details: leavebalances
                });
                if (status == 7 || status == 9) {
                    leaveBalancerecord.setValue({
                        fieldId: 'custrecord_leave_balance_lms',
                        value: (leavebalances + leaveDays)
                    });
                    log.debug({
                        title: 'leave balance  Id: ',
                        details: " leave added as cancelled or withdrawn"
                    });
                }

                {

                }


                saved = leaveBalancerecord.save();

            } catch (e) {
                log.error(e.name + "<--=-->" + e.message)
            }

        } else {
            log.debug({
                title: 'new  ',
                details: " new created "
            });
            var empRecord = context.newRecord;
            var emp1 = empRecord.getValue('custrecord_lms_employee');
            var leaveType = empRecord.getValue('custrecord_lms_leave_type');
            //var leavebal = empRecord.getValue('custrecord_lms_leave_balance');
            var leaveDays = empRecord.getValue('custrecord_lms_number_of_days');
            try {
                log.debug(emp1, leaveType);
                var leaveSearch = search.create({
                    type: "customrecord_lms_employee_leave",
                    filters: [
                        ["custrecord_lms_parent_record", "ANYOF", [emp1]],
                        "AND",
                        ["custrecord_lms_leave_type_1", "ANYOF", [leaveType]]
                    ],
                    columns: ["custrecord_leave_balance_lms"]
                });
                var leaveBalance = leaveSearch.run().getRange({
                    start: 0,
                    end: 100
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
                    title: 'leavebalances : ',
                    details: leavebalances
                });
                leaveBalancerecord.setValue({
                    fieldId: 'custrecord_leave_balance_lms',
                    value: (leavebalances - leaveDays)
                });
                log.debug({
                    title: 'leave balance  Id: ',
                    details: " leave deducted as approved "
                });
                if (status == 7 || status == 9) {
                    leaveBalancerecord.setValue({
                        fieldId: 'custrecord_leave_balance_lms',
                        value: (leavebalances + leaveDays)
                    });
                    log.debug({
                        title: 'leave balance  Id: ',
                        details: " leave added as cancelled or withdrawn"
                    });
                }

                saved = leaveBalancerecord.save();

            } catch (e) {
                log.error(e.name + "<--=-->" + e.message)
            }


        }

    }
    return {
        afterSubmit: afterSubmit
    }
});