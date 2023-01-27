/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 *Name       : Comp Off Lapse Scheduled
 *Purpose    : To lapse comp ff after 90 days if not used by employees 
 *Created On : 25-jan-2023
 *Author     : BINOD KAMAT
 *Script Type : Scheduled Script
 *Version    : 2.0
 */

define(['N/record', 'N/search'], function (record, search) {

    function execute(context) {
        try {


            const d = Date.parse(new Date()) - 90 * 24 * 60 * 60 * 1000;
            var day_90 = (new Date(d));
            dateFormat = (day_90.getMonth() + 1) + "/" + day_90.getDate() + "/" + day_90.getFullYear();
            log.debug("Workng Test", dateFormat);
            var leaveSearch = search.create({
                type: "customrecord_lms_comp_off_",
                filters: [
                    ["custrecord1475", "BEFORE", dateFormat],
                    "AND",
                    ["isinactive", "is", false]
                ],
                columns: ["custrecord_lms_employee_", "custrecord_lms_total_hours", "internalid"]
            });

            searchResult = leaveSearch.run().each(
                function (result) {
                    if (result == [] || result == null || result == {} || result == undefined) {
                        return false;
                    }
                    var empName = result.getValue('custrecord_lms_employee_');
                    var compOffHours = result.getValue('custrecord_lms_total_hours');
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
                        if (leaveBalance != [] && leaveBalance == undefined) {

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
                                    value: (leavebalances - totalDays)
                                });
                            }
                            log.debug({
                                title: 'New leave balances : ',
                                details: leavebalances - totalDays
                            });
                            saved = leaveBalancerecord.save();
                            log.debug({
                                title: 'leave balance  Id: ',
                                details: saved
                            });
                            log.debug(result.getValue('custrecord_lms_employee_') + "--:--" + result.getText('custrecord_lms_employee_'), result.getValue('custrecord_lms_total_hours'));
                            var otherId = record.submitFields({
                                type: "customrecord_lms_comp_off_",
                                id: result.getValue("internalid"),
                                values: {
                                    "isinactive": true
                                }
                            });
                        }
                    } catch (e) {
                        log.error(e.name + "<--=-->" + e.message)
                    }

                    return true;
                }
            );
        } catch (e) {
            log.error(e.name, e.message)
        }
    }
    return {
        execute: execute
    }

});