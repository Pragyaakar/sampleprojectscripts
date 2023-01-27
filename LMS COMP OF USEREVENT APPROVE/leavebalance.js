/**
 * @nApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/task', 'N/runtime'], function (task, runtime) {
    function afterSubmit(context) {
        try {
            /* if (context.type !== context.UserEventType.CREATE)
               {
                 return;
                }*/
            var empRecord = context.newRecord;
            log.debug("USAGE :", "Usage Available :" + runtime.getCurrentScript().getRemainingUsage())
            empid = empRecord.getValue("id");
            var emp1name = empRecord.getValue('firstname');
            var empType = empRecord.getValue('employeetype');
            var empStatus = empRecord.getValue('employeestatus');
            var gender = empRecord.getValue('gender');
            var hiredate = empRecord.getValue('hiredate');
            var monthLeftCycle = 1 + hiredate.getMonth();
            var location = empRecord.getValue('location');
            var subsidary = empRecord.getValue('subsidiary');
            var supervisor = empRecord.getValue('supervisor');
            var ar2 = [emp1name, empType, empStatus, gender, hiredate, monthLeftCycle, location, subsidary, supervisor, empid];
            var scheduledScriptTask = task.create({
                taskType: task.TaskType.SCHEDULED_SCRIPT
            });
            scheduledScriptTask.scriptId = "customscript_scheduling_leave_balance";
            scheduledScriptTask.deploymentId = "customdeploy1";
            scheduledScriptTask.params = {
                "custscript_list_ar2": ar2
            };
            var taskid = scheduledScriptTask.submit();
            log.debug("task created :" + taskid);
            log.debug("USAGE :", "Usage Remaining :" + runtime.getCurrentScript().getRemainingUsage())
        } catch (e) {
            log.error(e.name, e.message)
        }
    }
    return {
        afterSubmit: afterSubmit
    }
});