/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * 
 * Script Type          : User Event Script
 * Script Name          : CRW UE Amazon Unit Cost.js
 * Version              : 2.0
 * Author               : Pavani Narra
 * Start Date           : 21 JUNE 2019
 * Last Modified Date   : 21 JUNE 2019
 * 
 * Description          :  The User Event Script is used to update the unit cost in Raw billing amazon custom records if they have negative sign init.
 *    			
 */
define([],

		function() {



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

		try{
			if(scriptContext.type == scriptContext.UserEventType.CREATE)
			{

				var newRec = scriptContext.newRecord;
				//Get unit cost
				var unitCost = newRec.getValue('custrecord_amazon_unit_cost');
				//log.debug('unitCost',unitCost);
				if(unitCost != null && unitCost != ''){
					var negativeSign = unitCost.indexOf('-');
					//If we have negative sign we will replace it with braces.
					if(negativeSign == 0){
						var unit_Cost = unitCost.replace('-','(');
						unit_Cost = unit_Cost+')';
						log.debug('unitCost and unit_Cost',unitCost+' and '+unit_Cost);
						newRec.setValue('custrecord_amazon_unit_cost',unit_Cost);
					}
				}
			}
		}catch(ERR){
			log.error('Error occured While adding the braces in amazon record id:'+newRec.id,ERR);
		}

	}



	return {
		beforeSubmit: beforeSubmit
	};

});