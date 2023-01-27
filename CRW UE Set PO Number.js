/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record'],
/**
 * @param {record} record
 */
function(record) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(scriptContext) {

    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {

    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {
    	try{
    		var billRec   = scriptContext.newRecord;
			var recType   = billRec.type;
			var recId     = billRec.id;
			
			var billRecObj     = record.load({type:recType,id:recId});
			billRecObj.setValue({fieldId: 'custbody_crw_po_internalid',value: recId});
			var recordSaved = billRecObj.save({ignoreMandatoryFields:true});
			log.debug('recordSaved',recordSaved);
			
    	}catch(err){
    		log.error('Error while setting PO number',err);
    	}
    }

    return {
        afterSubmit: afterSubmit
    };
    
});
