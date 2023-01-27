/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

define(["N/log", "N/record", "N/runtime"], function (log, record, runtime) {
    function beforeLoad(context) {
        try {
            if (context.type == "view") {
                var obj_record = context.newRecord;
                var i_recordId = context.newRecord.id;
                log.debug("i_recordId", i_recordId);
                var s_record_type = context.newRecord.type;
                log.debug("s_record_type", s_record_type);
                var userobj = runtime.getCurrentUser();
                log.debug("userobj", userobj);
                var storemanger = obj_record.getValue("custrecord_afs_storemanager");
                log.debug("storemanger", storemanger);
                var current_user_id = userobj.id;
                log.debug("current_user_id", current_user_id);
                var warrentregno = obj_record.getValue("custrecord_afs_wrno");
                log.debug("warrentregno", warrentregno);

                var spare_part_qty = obj_record.getText({
                    fieldId: "custrecord_afs_spare_item_qty",
                });
                log.debug("spare_part_qty", spare_part_qty);

                var reject_button_status = obj_record.getValue(
                    "custrecord_afs_reject_button_status"
                );
                log.debug("Reject_button_status", reject_button_status);


                if (current_user_id) { //current_user_id==storemanger
                    //Storemanager internal id=1699//==storemanger

                    context.form.clientScriptModulePath = "./CS_approve_reject_btn.js";
                    if (!reject_button_status) {
                        var approve_btn = context.form.addButton({
                            id: "custpage_approve",
                            label: "Approve",
                            functionName: "onApprove()",
                            //functionName: "onApprove(" + warrentregno + " , " +spare_part_qty+"," +s_record_type+"," +i_recordId+")",
                            //made changes for alternative code..
                        });
                        var reject_btn = context.form.addButton({
                            id: "custpage_reject",
                            label: "Reject",
                            functionName: "onReject()",
                        });
                    }
                }

            }
        } catch (error) {
            log.error({
                title: "Catch Block Error",
                details: error,
            });
            log.error({
                title: "Catch Block Error Full",
                details: JSON.stringify(error),
            });
        }
    }
    return {
        beforeLoad: beforeLoad,
    };
});