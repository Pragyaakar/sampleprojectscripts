 /**
  * @NApiVersion 2.x
  * @NScriptType ScheduledScript
  */

 define(['N/config'],
     function (config) {
         function execute(context) {
             var companyInfo = config.load({
                 type: config.Type.COMPANY_PREFERENCES
             });
             var custscript5 = companyInfo.getValue({
                 fieldId: 'custscript5'
             });
             log.audit({
                 title: 'company',
                 details: 'custscript5: ' + custscript5
             })
         }
         return {
             execute: execute
         };
     });