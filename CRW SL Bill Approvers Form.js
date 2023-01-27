/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget','N/record','N/search','N/ui/message','N/task','N/runtime','N/url'],
		/**
		 * @param {serverWidget} serverWidget
		 */
		function(serverWidget,record,search,message,task,runtime,url) {

	/**
	 * Definition of the Suitelet script trigger point.
	 *
	 * @param {Object} context
	 * @param {ServerRequest} context.request - Encapsulation of the incoming request
	 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
	 * @Since 2015.2
	 */

	/***************Global Variables*****************/
	var updateScriptParatmers = ['customscript_crw_ue_bill_approvalprocess','customdeploy_crw_ue_bill_approvalprocess'];
	var ScheduleScript        = ['customscript_crw_sc_update_bill_approver','customdeploy_crw_sc_update_bill_approver'];
	var selfSuitelet          = ['customscript_crw_sl_bill_approvers_form','customdeploy_crw_sl_bill_approvers_form'];
	var suiteletId            = '';
	/***************Global Variables*****************/
	function onRequest(context) {

		try{
			var selfSuiteletUrl     = url.resolveScript({scriptId: selfSuitelet[0],deploymentId: selfSuitelet[1]});
			var subs                = context.request.parameters.subs;
			var existingSecondApprover = '';
			var existingThirdApprover  = '';
			var existingFourthApprover = '';
			var existingFinanceApprover = new Array;
			var secondApprJson         = '';
			var thirdApprJson          = '';
			var fourthApprJson         = '';
			var financeApproverJson    = '';

			log.debug('subs',subs);

			var form = serverWidget.createForm({
				title : 'Bill Approvers'
			});
			var suiteletDeployment = runtime.getCurrentScript().deploymentId;
			var suiteletSearch = search.create({
				type: search.Type.SCRIPT_DEPLOYMENT,
				columns: [{
					name: 'internalid'
				}],
				filters: [{
					name: 'scriptid',
					operator: 'is',
					values: suiteletDeployment
				}]
			});
			if( suiteletSearch != null && suiteletSearch != '' && suiteletSearch != undefined){
				var suiteletResults = suiteletSearch.run().getRange({start:0,end:5});

				suiteletId = suiteletResults[0].getValue({name:'internalid'});
			}
			if(context.request.method == 'GET' && (subs == null || subs == '' || subs == undefined)){
				var updateTaskId   =   record.submitFields({
					type: record.Type.SCRIPT_DEPLOYMENT,
					id: suiteletId,
					values: {
						custscript_crw_bill_task_id: ''
					},
					options: {
						ignoreMandatoryFields : true	
					}
				});
			}


			if( context.request.method == 'POST'){
				var selectedSubsidiary = context.request.parameters.custpage_subsidiary;
				if(selectedSubsidiary != null && selectedSubsidiary != '' && selectedSubsidiary != undefined){
					selfSuiteletUrl = selfSuiteletUrl+'&subs='+selectedSubsidiary;
					log.debug('selectedSubsidiary',selectedSubsidiary);
					log.debug('selfSuiteletUrl',selfSuiteletUrl);
					context.response.write('<html><body><script>window.open("'+selfSuiteletUrl+'","_self");</script></body></html>');
					return;
				}
				var taskIdParameter = runtime.getCurrentScript().getParameter({name:'custscript_crw_bill_task_id'});
				var existingSubs   = context.request.parameters.custpage_subs;
				subs               = existingSubs;
				//	log.debug('secondApprover',secondApprover);

				//	log.debug('secondApprover-'+secondApprover+', thirdApprover-'+thirdApprover,'fourthApprover-'+fourthApprover/*+', fifthApprover-'+fifthApprover*/);
				//	log.debug('financeApprover-'+financeApprover);

			}

			if( subs != '' && subs != null && subs != undefined){
				//search to get the deployment Id
				var deploymentSearch = search.create({
					type: search.Type.SCRIPT_DEPLOYMENT,
					columns: [{
						name: 'internalid'
					}],
					filters: [{
						name: 'scriptid',
						operator: 'is',
						values: updateScriptParatmers[1]
					}]
				});
				if( deploymentSearch != null && deploymentSearch != '' && deploymentSearch != undefined){
					var deploymentResults = deploymentSearch.run().getRange({start:0,end:5});

					var deployementId = deploymentResults[0].getValue({name:'internalid'});
					log.debug('deployementId',deployementId);
					//Load script deployment page to get the already existing scripts
					var userEventScript = record.load({
						type: record.Type.SCRIPT_DEPLOYMENT,
						id: deployementId
					});

					secondApprJson = userEventScript.getValue({fieldId:'custscript_crw_bill_second_approver'});
					thirdApprJson  = userEventScript.getValue({fieldId:'custscript_crw_bill_third_approver'});
					fourthApprJson = userEventScript.getValue({fieldId:'custscript_crw_bill_fourth_approver'});
					financeApproverJson= userEventScript.getValue({fieldId:'custscript_crw_bill_finance_approver'});

					//fifthApprJson  = userEventScript.getValue({fieldId:'custscript_crw_fifth_approver_2'});
					if(secondApprJson != null && secondApprJson != '' && secondApprJson != undefined){
						secondApprJson = JSON.parse(secondApprJson);
						if(secondApprJson[subs] != null && secondApprJson[subs] != '' && secondApprJson[subs] != undefined){	
							existingSecondApprover = secondApprJson[subs][0];	
						}
					}else{secondApprJson = {};}	
					if(thirdApprJson != null && thirdApprJson != '' && thirdApprJson != undefined){
						thirdApprJson = JSON.parse(thirdApprJson);
						if(thirdApprJson[subs] != null && thirdApprJson[subs] != '' && thirdApprJson[subs] != undefined){	
							existingThirdApprover = thirdApprJson[subs][0];	
						}
					}else{thirdApprJson = {};}
					if(fourthApprJson != null && fourthApprJson != '' && fourthApprJson != undefined){
						fourthApprJson = JSON.parse(fourthApprJson);
						if(fourthApprJson[subs] != null && fourthApprJson[subs] != '' && fourthApprJson[subs] != undefined){	
							existingFourthApprover = fourthApprJson[subs][0];	
						}
					}else{fourthApprJson = {};}
					
					if(financeApproverJson != null && financeApproverJson != '' && financeApproverJson != undefined){
						financeApproverJson = JSON.parse(financeApproverJson);
						if(financeApproverJson[subs] != null && financeApproverJson[subs] != '' && financeApproverJson[subs] != undefined){	
							var sub=0;
							while( sub<financeApproverJson[subs].length){
								existingFinanceApprover.push(financeApproverJson[subs][sub]);
								sub = sub+2;
							}
							//	existingFinanceApprover = fourthApprJson[subs][0];	
						}
					}else{financeApproverJson = {};}
				}
			}

			if( context.request.method == 'POST'){
				var secondApprover     = context.request.parameters.custpage_second_approver;
				var secondApproverText = context.request.parameters.custpage_second_approver_display;
				var thirdApprover      = context.request.parameters.custpage_third_approver;
				var thirdApproverText  = context.request.parameters.custpage_third_approver_display;	
				var fourthApprover     = context.request.parameters.custpage_fourth_approver;
				var fourthApproverText = context.request.parameters.custpage_fourth_approver_display;
				var financeApprover    = context.request.parameters.custpage_finance_approver;
				var financeApproverText= context.request.parameters.custpage_finance_approver_display;

				if(secondApprover != null && secondApprover != '' && thirdApprover != null && thirdApprover != '' && fourthApprover != null && fourthApprover != '' && financeApprover != null && financeApprover != '' /*&& fifthApprover != null && fifthApprover != ''*/){

					if(existingSecondApprover !=  secondApprover || existingThirdApprover !=  thirdApprover || existingFourthApprover !=  fourthApprover || existingFinanceApprover != financeApprover/*|| existingFifthApprover != fifthApprover*/){
						//Update script parameters
						secondApprJson[subs] = [secondApprover,secondApproverText];	
						thirdApprJson[subs]  = [thirdApprover,thirdApproverText];	
						fourthApprJson[subs] = [fourthApprover,fourthApproverText];	
						financeApprover = financeApprover.split('');
						var approverList = new Array();
						var financeApproverJson = {};

						for(var setsub=0; setsub<financeApprover.length; setsub++){
							approverList.push(financeApprover[setsub]);
						}

						var approverSearch = search.create({
							type: search.Type.EMPLOYEE,
							columns: [{name: 'internalid'},{name: 'entityid'}],
							filters: [{
								name: 'internalid',
								operator: 'anyof',
								values: approverList
							}]
						});
						if( approverSearch != null && approverSearch != '' && approverSearch != undefined){
							var approverResults = approverSearch.run().getRange({start:0,end:1000});
							financeApproverJson[subs] = [];
							for(var app=0; app<approverResults.length; app++){
								var employeeId = approverResults[app].getValue({name:'internalid'});
								var employeeName = approverResults[app].getValue({name:'entityid'});
								financeApproverJson[subs].push(employeeId);
								financeApproverJson[subs].push(employeeName);
							}
						}
						
						log.debug('financeApproverJson',financeApproverJson);
						
						var  updatedDeploymnt   =   record.submitFields({
							type: record.Type.SCRIPT_DEPLOYMENT,	
							id: deployementId,
							values: {
								custscript_crw_bill_second_approver: JSON.stringify(secondApprJson),
								custscript_crw_bill_third_approver : JSON.stringify(thirdApprJson),
								custscript_crw_bill_fourth_approver: JSON.stringify(fourthApprJson),
								custscript_crw_bill_finance_approver : JSON.stringify(financeApproverJson)
							},
							options: {
								ignoreMandatoryFields : true	
							}
						});
					}
					if(updatedDeploymnt != null && updatedDeploymnt != '' && updatedDeploymnt != undefined){
						form.addPageInitMessage({type: message.Type.INFORMATION, message: 'Updating the Approvers Status: Processing'}); 
						context.response.writePage(form);
						//Call Schedule Script
						var mrTask = task.create({
							taskType: task.TaskType.SCHEDULED_SCRIPT,
							scriptId: ScheduleScript[0],
							deploymentId: ScheduleScript[1],
							params: {custscript_crw_bill_subsidiary:subs}
						});

						var taskId = mrTask.submit();
						log.debug('taskId',taskId);
						if(taskId != null && taskId != '' && taskId != undefined){

							var updateTaskId   =   record.submitFields({
								type: record.Type.SCRIPT_DEPLOYMENT,
								id: suiteletId,
								values: {
									custscript_crw_bill_task_id: taskId
								},
								options: {
									ignoreMandatoryFields : true	
								}
							});
						}
					}else{
						if( taskIdParameter == null || taskIdParameter == '' ){
							form.addPageInitMessage({type: message.Type.INFORMATION, message: 'Approvers are Same', duration: 5000}); 
						}else{
							var currentStatus = task.checkStatus(taskIdParameter);
							log.debug('currentStatus',currentStatus);
							if(currentStatus['status'] != 'COMPLETE' && currentStatus['status'] != 'FAILED'){
								form.addPageInitMessage({type: message.Type.INFORMATION, message: 'Updating the Approvers Status : Processing'}); 
							}else{
								form.addPageInitMessage({type: message.Type.CONFIRMATION, message: 'Updating the Approvers Status : Completed'}); 
							}
						}
					}
				}else{
					form.addPageInitMessage({type: message.Type.ERROR, message: "Approvers Value Can't be null", duration: 5000}); 
				}
			}


			if( subs == '' || subs == null || subs == undefined){
				var subsidiaryField = form.addField({
					id : 'custpage_subsidiary',
					type : serverWidget.FieldType.SELECT,
					label : 'Select Subsidiary',
					source: 'subsidiary'
				});
				form.addSubmitButton({
					label : 'Submit'
				});
			}else{
				var subsidiaryField = form.addField({
					id : 'custpage_subs',
					type : serverWidget.FieldType.SELECT,
					label : 'Select Subsidiary',
					source: 'subsidiary'
				});
				subsidiaryField.defaultValue = subs;
				subsidiaryField.updateDisplayType({displayType: serverWidget.FieldDisplayType.DISABLED});
				var secondApproverField = form.addField({
					id : 'custpage_second_approver',
					type : serverWidget.FieldType.SELECT,
					label : 'Second Approver',
					source: 'employee'
				});

				var thirdApproverField = form.addField({
					id : 'custpage_third_approver',
					type : serverWidget.FieldType.SELECT,
					label : 'Third Approver',
					source: 'employee'
				});

				var fourthApproverField = form.addField({
					id : 'custpage_fourth_approver',
					type : serverWidget.FieldType.SELECT,
					label : 'Fourth Approver',
					source: 'employee'
				});

				var financeApproverField = form.addField({
					id : 'custpage_finance_approver',
					type : serverWidget.FieldType.MULTISELECT,
					label : 'Finance Approver',
					source: 'employee'
				});

				form.addSubmitButton({
					label : 'Submit'
				});

				form.addResetButton({
					label : 'Reset'
				});

				form.addButton({
					id : 'custpage_refresh',
					label : 'Refresh',
					functionName : 'window.location.reload();'
				});
				if( context.request.method == 'POST'){
					var secondApprover = context.request.parameters.custpage_second_approver;
					var thirdApprover  = context.request.parameters.custpage_third_approver;
					var fourthApprover = context.request.parameters.custpage_fourth_approver;
					var financeApprover = context.request.parameters.custpage_finance_approver;
					secondApproverField.defaultValue = secondApprover;
					thirdApproverField.defaultValue  = thirdApprover;
					fourthApproverField.defaultValue = fourthApprover;
					financeApproverField.defaultValue = financeApprover;
					subsidiaryField.defaultValue     = subs;
				}else{
					secondApproverField.defaultValue = existingSecondApprover;
					thirdApproverField.defaultValue  = existingThirdApprover;
					fourthApproverField.defaultValue = existingFourthApprover;
					financeApproverField.defaultValue = existingFinanceApprover;
					subsidiaryField.defaultValue     = subs;
				}
			}

			context.response.writePage(form);

		}catch(e){
			log.error('Unexpected Error',e);
			context.response.write('Unexpected Error. Please Contact your Administrator.');
		}

	}

	return {
		onRequest: onRequest
	};

});