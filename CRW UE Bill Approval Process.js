/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/email', 'N/record', 'N/runtime', 'N/search', 'N/url', 'N/render', 'N/file'],
		/**
		 * @param {email} email
		 * @param {record} record
		 * @param {runtime} runtime
		 * @param {search} search
		 */
		function(serverWidget, email, record, runtime, search, url, render, file) {

	var suiteletCalled      = ['customscript_crw_sl_bill_approval','customdeploy_crw_sl_bill_approval'];
	var clientFileName      = 'CRW CS Prevent User From Saving Bill.js';
	var globalLLCSubsidiary = '2';
	var EllationLLCdbaCrunchyroll ='16';
  
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
		try{
			/*if(scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.EDIT ){
				var billRec          = scriptContext.newRecord;
				var billForm         = scriptContext.form;
				var createdFrom      = billRec.getValue({fieldId: 'custbody_crw_po_internalid'});
				log.debug('createdFrom ',createdFrom);
				if(isEmpty(createdFrom)){
					var firstApproverField = billForm.getField({id : 'custbody_first_approver'});
					firstApproverField.isMandatory = true;
				}
			}*/
			if(scriptContext.type == scriptContext.UserEventType.VIEW){

				var billForm       = scriptContext.form;
				var billRec        = scriptContext.newRecord;
				var currentUser    = runtime.getCurrentUser();
				var subsidiary     = billRec.getValue({fieldId:'subsidiary'});

				if(subsidiary == globalLLCSubsidiary || subsidiary == EllationLLCdbaCrunchyroll){

					var billRelatedRecSearch = search.create({
						type: billRec.type,
						title: 'Bill Related Records Search',
						id: 'customsearch_bill_relared_records',
						columns: [{name: 'createdfrom'}],
						filters: [{name: 'internalid',operator: 'is',values: billRec.id},{name: 'mainline',operator: 'is',values: 'T'}]
					});

					var billSearchResult = billRelatedRecSearch.run().getRange({
						start: 0,
						end: 50
					});

					for (var i = 0; i < billSearchResult.length; i++) {
						var billCreatedFrom = billSearchResult[i].getValue({
							name: 'createdfrom'
						});
						log.debug('billCreatedFrom in view',billCreatedFrom);
					}

					if(isEmpty(billCreatedFrom)){
						//		if(subsidiary != mangaSubsidiary && (customForm == expenseCustomForm || customForm == funExpenseForm || customForm == funInventoryForm)){
						/*var firstApproverField = billForm.getField({id : 'custbody_first_approver'});
					firstApproverField.isMandatory = true;*/
						var firstApprover  = billRec.getValue({fieldId: 'custbody_first_approver'});
						var secondApprover = billRec.getValue({fieldId: 'custbody8'});
						var thirdApprover  = billRec.getValue({fieldId: 'custbody9'});
						var fourthApprover = billRec.getValue({fieldId: 'custbody10'});
						var financeApprover = billRec.getValue({fieldId : 'custbody_crw_finance_approver'});
						//var fifthApprover  = billRec.getValue({fieldId: 'custbody_crw_fifth_approver'});
						var billCreator    = billRec.getValue({fieldId: 'custbody_createdby'});
						var stage          = billRec.getValue({fieldId: 'custbody_stage'});
						var rejector       = billRec.getValue({fieldId: 'custbody_rejected_by'});
						var itemLines      = billRec.getLineCount({sublistId:'item'});
						var expenselines   = billRec.getLineCount({sublistId:'expense'});
						var approvalStatus = billRec.getValue({fieldId: 'approvalstatus'});

						var financeAppr = financeApprover;
						log.debug('financeApprover',financeApprover+' and '+currentUser.id);
						log.debug(financeAppr.indexOf((currentUser.id).toString()));

						var approverSearchResults = '';
						var linestobeApproved     = new Array();

						var suiteletUrl = url.resolveScript({scriptId: suiteletCalled[0],deploymentId: suiteletCalled[1]});
						var approveUrl  = suiteletUrl+"&action=approve&mode=vianetsuite"+"&recId="+billRec.id+"&approver="+currentUser.id+"&role="+currentUser.role+"&redir=redir";
						var rejectUrl   = suiteletUrl+"&action=reject"+"&recId="+billRec.id+"&approver="+currentUser.id+"&role="+currentUser.role+"&redir=redir";
						var domainUrl   = url.resolveDomain({hostType: url.HostType.APPLICATION});

						/*********************Removing PO Edit Button****************/
						log.debug((approvalStatus == 2 || approvalStatus == 3) && (currentUser.role != 3 && currentUser.id != billCreator && currentUser.id != 688 && currentUser.role != '1049'));
						if((currentUser.id != billCreator && currentUser.role != 3 && ((stage == 0 && currentUser.id != firstApprover && !isEmpty(stage)) || (stage == 1 && currentUser.id != secondApprover) || (stage == 2 && currentUser.id != thirdApprover) || (stage == 3 && currentUser.id != fourthApprover) || /*(stage == 4 && currentUser.id != fifthApprover) ||*/ (stage == 4 && financeApprover.indexOf(currentUser.id) != -1))) || ((approvalStatus == 2 || approvalStatus == 3) && (currentUser.role != 3 && currentUser.id != billCreator && currentUser.id != 688 && currentUser.role != '1049'))){
							billForm.removeButton({id :'edit'});
						}
						/*********************Removing PO Edit Button******************/

						/********************Adding Approve and reject Buttons*********/
						//if(rejector == null || rejector == '' || rejector == undefined){
							if((currentUser.id != billCreator) && (approvalStatus == 1 && ((stage == 0 && (currentUser.id == firstApprover || currentUser.role == '3')) || (stage == 1 && currentUser.id == secondApprover) || (stage == 2 && currentUser.id == thirdApprover) || (stage == 3 && currentUser.id == fourthApprover) || (stage == 4 && financeAppr.indexOf((currentUser.id).toString()) != -1) || ((stage == 1 || stage ==2 || stage == 3 || stage == 4) && currentUser.role == '3')))  || (stage == 4 && ( currentUser.id == 764 && (currentUser.role == '1045' || currentUser.role == '1026')) && approvalStatus == 1) || ((currentUser.id == 688 && currentUser.role == '1049') && approvalStatus == 1)){
								billForm.addButton({ id : 'custpage_approve', label : 'Approve',functionName: "window.open('" + approveUrl +  "','_self')"});
								billForm.addButton({ id : 'custpage_reject', label : 'Reject',functionName: "window.open('" + rejectUrl +  "','_self')"});
							}else{
								if(currentUser.role == '3'){
									var formObj     = scriptContext.form;
									var departments = {};
									var departmentArray ='';
									if(approvalStatus == 1){
										var clientFileId = getFileId(clientFileName);
										if(clientFileId != null && clientFileId != ''){
											billForm.clientScriptFileId = clientFileId;
										}else{
											log.error('Error Occured while retrieving client FileID for record:'+billRec.id,e);
										}
									}
								}
							}
						//}
					}
				}
			}

			/********************Adding Approve and reject Buttons*********/

			//	}
		}catch(e){
			log.error('Error Occured while Removing standard EDIT button in record:'+billRec.id,e);
		}

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
			var Subsidiary = billRec.getValue({ fieldId: 'subsidiary'});

				log.debug("Subsidiary in after Submit", Subsidiary);
				if (Subsidiary == 15 ||Subsidiary == 27)
				{
                            record.submitFields({
										type: 'vendorbill',
										id: billRec.id,
										values: {
										'approvalstatus': 2
										}
										});
				}
					else{
			log.debug('runtime.executionContext',runtime.executionContext);
			if(runtime.executionContext != runtime.ContextType.SUITELET && runtime.executionContext != runtime.ContextType.SCHEDULED &&scriptContext.type != scriptContext.UserEventType.DELETE){
				var billRec   = scriptContext.newRecord;
				var recType   = billRec.type;
				var recId     = billRec.id;
				var subsidiary= billRec.getValue({fieldId:'subsidiary'});
				var tableData = '<table><thead><tr><td>Approver</td><td>Approver Name</td></thead><tbody>';	

				if(subsidiary == globalLLCSubsidiary || subsidiary == EllationLLCdbaCrunchyroll){
					var billRelatedRecSearch = search.create({
						type: recType,
						title: 'Bill Related Records Search',
						id: 'customsearch_bill_relared_records',
						columns: [{name: 'createdfrom'}],
						filters: [{name: 'internalid',operator: 'is',values: recId},{name: 'mainline',operator: 'is',values: 'T'}]
					});

					var billSearchResult = billRelatedRecSearch.run().getRange({
						start: 0,
						end: 50
					});

					for (var i = 0; i < billSearchResult.length; i++) {
						var billCreatedFrom = billSearchResult[i].getValue({
							name: 'createdfrom'
						});
						log.debug('billCreatedFrom',billCreatedFrom);
					}

					if(isEmpty(billCreatedFrom)){
						var passcode       = {};
						var emailauthor    = '';
						var isEdited       = false;
						var billRecObj     = record.load({type:recType,id:recId});
						var currentUser    = runtime.getCurrentUser();
						var documentNumber;
						var referenceNumber= billRecObj.getValue({fieldId : 'tranid'});
						if(!isEmpty(referenceNumber)){
							documentNumber = referenceNumber;
						}else{
							documentNumber = billRecObj.getValue({fieldId : 'transactionnumber'});
						}
						var subsidiary     = billRecObj.getValue({fieldId : 'subsidiary'});
						var billStatus     = billRecObj.getValue({fieldId : 'approvalstatus'});
						var totalAmount    = billRecObj.getValue({fieldId : 'total'});
						var costCenter     = billRecObj.getValue({fieldId : 'department'});
						var firstApprover  = billRecObj.getValue({fieldId : 'custbody_first_approver'});
						var firstApproverText = billRecObj.getText({fieldId : 'custbody_first_approver'});

						var newFirstApprover  = billRecObj.getValue({fieldId : 'custbody_first_approver'});
						var newSecondApprover = billRecObj.getValue({fieldId : 'custbody8'});
						var newThirdApprover  = billRecObj.getValue({fieldId : 'custbody9'});	
						var newFourthApprover = billRecObj.getValue({fieldId : 'custbody10'});	
						var newFinanceApprover = billRecObj.getValue({fieldId : 'custbody_crw_finance_approver'});
						var itemLines      = billRecObj.getLineCount({sublistId:'item'});
						var expenselines   = billRecObj.getLineCount({sublistId:'expense'});


						if(scriptContext.type == scriptContext.UserEventType.EDIT){
							var oldBillRec          = scriptContext.oldRecord;
							var oldTotal            = oldBillRec.getValue({fieldId:'total'});
							var oldCostCenter       = oldBillRec.getValue({fieldId: 'department'});
							var oldFirstApprover    = oldBillRec.getValue({fieldId: 'custbody_first_approver'});
							var oldSecondApprover   = oldBillRec.getValue({fieldId: 'custbody8'});
							var oldThirdApprover    = oldBillRec.getValue({fieldId: 'custbody9'});
							var oldFourthApprover   = oldBillRec.getValue({fieldId: 'custbody10'});
							var oldFinanceApprover  = oldBillRec.getValue({fieldId: 'custbody_crw_finance_approver'});
							var oldItemLines        = oldBillRec.getLineCount({sublistId:'item'});
							var oldExpenselines     = oldBillRec.getLineCount({sublistId:'expense'});

							if(totalAmount != oldTotal  || costCenter != oldCostCenter || itemLines != oldItemLines || expenselines != oldExpenselines ||
									newFirstApprover != oldFirstApprover  || newSecondApprover != oldSecondApprover || newThirdApprover != oldThirdApprover || newFourthApprover != oldFourthApprover
									|| newFinanceApprover != oldFinanceApprover){
								log.debug('totalAmount-'+totalAmount+', oldTotal-'+oldTotal+', costCenter-'+costCenter+', oldCostCenter-'+oldCostCenter);
								log.debug('itemLines-'+itemLines+', oldItemLines-'+oldItemLines,'expenselines-'+expenselines+', expenselines-'+oldExpenselines);
								isEdited = true;
							}
							//checking line level values
							if(itemLines > 0 && isEdited != true){
								for(var x=0;x<itemLines;x++){
									var item        = billRecObj.getSublistValue({sublistId:'item',fieldId:'item',line:x});
									var lineCC      = billRecObj.getSublistValue({sublistId:'item',fieldId:'department',line:x});
									var propHier    = billRecObj.getSublistValue({sublistId:'item',fieldId:'class',line:x});
									var oldItem     = oldBillRec.getSublistValue({sublistId:'item',fieldId:'item',line:x});
									var oldLineCC   = oldBillRec.getSublistValue({sublistId:'item',fieldId:'department',line:x});
									var oldPropHier = oldBillRec.getSublistValue({sublistId:'item',fieldId:'class',line:x});
									log.debug('item-'+item+', oldItem-'+oldItem);
									log.debug('propHier-'+propHier+', oldPropHier-'+oldPropHier,'expenselines-'+expenselines);

									if(item != oldItem || lineCC != oldLineCC || propHier != oldPropHier){
										isEdited = true;
										break;
									}
								}
							}
							if(expenselines > 0 && isEdited != true){
								for(var x=0;x<expenselines;x++){
									var account     = billRecObj.getSublistValue({sublistId:'expense',fieldId:'account',line:x});
									var lineCC      = billRecObj.getSublistValue({sublistId:'expense',fieldId:'department',line:x});
									var propHier    = billRecObj.getSublistValue({sublistId:'expense',fieldId:'class',line:x});
									var oldAccount  = oldBillRec.getSublistValue({sublistId:'expense',fieldId:'account',line:x});
									var oldLineCC   = oldBillRec.getSublistValue({sublistId:'expense',fieldId:'department',line:x});
									var oldPropHier = oldBillRec.getSublistValue({sublistId:'expense',fieldId:'class',line:x});

									if(account != oldAccount || lineCC != oldLineCC || propHier != oldPropHier){
										isEdited = true;
										break;
									}
								}
							}
						}
						log.debug('isEdited',isEdited);

						if(((scriptContext.type == scriptContext.UserEventType.CREATE && billStatus == 1) && (!isEmpty(firstApprover))) || (isEdited == true && (!isEmpty(firstApprover)))){
							tableData += '<tr><td>1st Approver</td><td>'+firstApproverText+'</td></tr>';
							passcode[firstApprover] = Number(Math.floor(Math.random() * 9999) + 1000);

							log.debug('totalAmount',totalAmount);
							var secondApproverJson = runtime.getCurrentScript().getParameter({name:'custscript_crw_bill_second_approver'});
							var thirdApproverJson  = runtime.getCurrentScript().getParameter({name:'custscript_crw_bill_third_approver'});
							var fourthApproverJson = runtime.getCurrentScript().getParameter({name:'custscript_crw_bill_fourth_approver'});
							var financeApproverJson= runtime.getCurrentScript().getParameter({name:'custscript_crw_bill_finance_approver'});

							if(!isEmpty(secondApproverJson) && !isEmpty(thirdApproverJson) && !isEmpty(fourthApproverJson) && !isEmpty(financeApproverJson )){
								secondApproverJson = JSON.parse(secondApproverJson);
								thirdApproverJson  = JSON.parse(thirdApproverJson);
								fourthApproverJson = JSON.parse(fourthApproverJson);
								financeApproverJson= JSON.parse(financeApproverJson);

								var secondApprover = secondApproverJson[subsidiary][0];	
								var thirdApprover  = thirdApproverJson[subsidiary][0];	
								var fourthApprover = fourthApproverJson[subsidiary][0];	
								var financeApprover = new Array();
								if(!isEmpty(financeApproverJson)){
									var sub=0;
									while( sub<financeApproverJson[subsidiary].length){
										financeApprover.push(financeApproverJson[subsidiary][sub]);
										sub = sub+2;
									}
								}
								log.debug('financeApprover',financeApprover);
								//	var financeApprover= [financeApproverJson[subsidiary][0],financeApproverJson[subsidiary][2]];	

								if(totalAmount > 50000){
									if(isEmpty(newSecondApprover))
										billRecObj.setValue({fieldId: 'custbody8',value: secondApprover});								
									if(isEmpty(newThirdApprover))
										billRecObj.setValue({fieldId: 'custbody9',value: thirdApprover});	
									tableData += '<tr><td>2nd Approver</td><td>'+secondApproverJson[subsidiary][1]+'</td></tr>';
									tableData += '<tr><td>3rd Approver</td><td>'+thirdApproverJson[subsidiary][1]+'</td></tr>';
									if(Object.keys(passcode).indexOf(secondApprover) == -1){
										passcode[secondApprover] = Number(Math.floor(Math.random() * 9999) + 1000);
									}
									if(Object.keys(passcode).indexOf(thirdApprover) == -1){
										passcode[thirdApprover] = Number(Math.floor(Math.random() * 9999) + 1000);
									}
								}else{
									var secondAppr = billRecObj.getValue({fieldId: 'custbody8'});
									var thirdAppr  = billRecObj.getValue({fieldId: 'custbody9'});
									if(!isEmpty(secondAppr)){
										billRecObj.setValue({fieldId: 'custbody8',value: ''});
									}
									if(!isEmpty(thirdAppr)){
										billRecObj.setValue({fieldId: 'custbody9',value: ''});
									}
								}

								if(totalAmount > 500000){
									if(isEmpty(newFourthApprover))
										billRecObj.setValue({fieldId: 'custbody10',value: fourthApprover});
									tableData += '<tr><td>4th Approver</td><td>'+fourthApproverJson[subsidiary][1]+'</td></tr>';
									if(Object.keys(passcode).indexOf(fourthApprover) == -1){
										passcode[fourthApprover] = Number(Math.floor(Math.random() * 9999) + 1000);
									}
								}else{
									var fourthAppr = billRecObj.getValue({fieldId: 'custbody10'});
									if(!isEmpty(fourthAppr)){
										billRecObj.setValue({fieldId: 'custbody10',value: ''});
									}
								}
								for(var app=0; app<financeApprover.length; app++){
									passcode[financeApprover[app]] = Number(Math.floor(Math.random() * 9999) + 1000);
								}
								log.debug('passcode',passcode);
								billRecObj.setValue({fieldId: 'custbody_crw_finance_approver',value: financeApprover});
								billRecObj.setValue({fieldId: 'custbody_stage'            ,value: 0 });
								billRecObj.setValue({fieldId: 'custbody_crw_next_approver',value: firstApprover});
								billRecObj.setValue({fieldId: 'custbody_last_approved_by' ,value: ''});
								billRecObj.setValue({fieldId: 'custbody_approved_by'      ,value: ''});
								billRecObj.setValue({fieldId: 'custbody_crw_approved_by_via_netsuite',value: ''});							
								billRecObj.setValue({fieldId: 'custbody_rejected_by'      ,value: ''});
								billRecObj.setValue({fieldId: 'custbody_crw_po_appr_passcode',value:JSON.stringify(passcode)});
								billRecObj.setValue({fieldId: 'custbody_crw_approvers_skipped',value:''});

								if(isEdited == true){
									billRecObj.setValue({fieldId:'custbody_crw_po_approval_edited',value:true});
									billRecObj.setValue({fieldId:'custbody11',value:''});
									emailauthor = billRecObj.getValue({fieldId: 'custbody_createdby'});
									billRecObj.setValue({fieldId: 'approvalstatus',value: 1 });
								}else{
									emailauthor = currentUser.id;
									billRecObj.setValue({fieldId:'custbody11',value:''});
									billRecObj.setValue({fieldId: 'custbody_createdby',value:currentUser.id});
									billRecObj.setValue({fieldId: 'custbody_crw_po_approval_edited',value:false});
								}	

								var recordSaved = billRecObj.save({ignoreMandatoryFields:true});
								log.debug('recordSaved',recordSaved);

								tableData    += '</tbody></table><div style="height:10px;"></div>';

								tableData    += '<div>';
								if(itemLines > 0){
									tableData    += '<h5 style="text-align: left;"><b style="padding-right:70px;"><u>Item Sublist</u></b></h5><div style="height:10px;"></div><table>';
									tableData += '<thead><tr><th>Item</th><th>Description</th><th>Quantity</th><th>Unit Rate</th><th>Amount</th><th>Currency</th><th>Property Hierarchy</th><th>Cost Center</th></tr></thead><tbody>';
									for(var p=0; p<itemLines; p++){
										tableData += '<tr><td>'+billRecObj.getSublistText({sublistId:'item',fieldId:'item',line:p});+'</td>';
										tableData += '<td>'+billRecObj.getSublistValue({sublistId:'item',fieldId:'description',line:p});+'</td>';
										tableData += '<td>'+billRecObj.getSublistValue({sublistId:'item',fieldId:'quantity',line:p});+'</td>';
										tableData += '<td>'+billRecObj.getSublistValue({sublistId:'item',fieldId:'rate',line:p});+'</td>';
										tableData += '<td>'+billRecObj.getSublistText({sublistId:'item',fieldId:'amount',line:p});+'</td>';
                                        tableData += '<td>' + billRecObj.getText({ fieldId:'currency', line:p }); +'</td>';
										tableData += '<td>'+billRecObj.getSublistText({sublistId:'item',fieldId:'class',line:p});+'</td>';
										tableData += '<td>'+billRecObj.getSublistText({sublistId:'item',fieldId:'department',line:p});+'</td></tr>';
									}
									tableData    += '</tbody></table><div style="height:15px;"></div>';
								}
								if(expenselines > 0){
									tableData    += '<h5 style="text-align: left;"><b style="padding-right:70px;"><u>Expense Sublist</u></b></h5><div style="height:10px;"></div><table>';
									tableData += '<thead><tr><th>Account</th><th>Amount</th><th>Currency</th><th>Memo</th><th>Property Hierarchy</th><th>Cost Center</th></tr></thead><tbody>';
									for(var q=0; q<expenselines; q++){
										tableData += '<tr><td>'+billRecObj.getSublistText({sublistId:'expense',fieldId:'account',line:q});+'</td>';
										tableData += '<td>'+billRecObj.getSublistText({sublistId:'expense',fieldId:'amount',line:q});+'</td>';
                                        tableData += '<td>' + billRecObj.getText({ fieldId: 'currency', line: q }); +'</td>';
                                        tableData += '<td>'+billRecObj.getSublistValue({sublistId:'expense',fieldId:'memo',line:q});+'</td>';
										tableData += '<td>'+billRecObj.getSublistText({sublistId:'expense',fieldId:'class',line:q});+'</td>';
										tableData += '<td>'+billRecObj.getSublistText({sublistId:'expense',fieldId:'department',line:q});+'</td></tr>';
									}
									tableData    += '</tbody></table>';
								}
								tableData    += '</div>';

								var suiteletUrl = url.resolveScript({scriptId : suiteletCalled[0],deploymentId : suiteletCalled[1],returnExternalUrl : true});
								//	var billFile    = render.transaction({entityId : recId,printMode : render.PrintMode.PDF});
								var billRelatedFileSearch = search.create({
									type: "vendorbill",
									filters:
										[  ["type","anyof","VendBill"], 
										   "AND", 
										   ["internalid","anyof",recId], 
										   "AND", 
										   ["mainline","is","T"]
										],
										columns:
											[
											 search.createColumn({name: "internalid", join: "file", label: "Internal ID"})
											 ]
								});
								var searchResult = billRelatedFileSearch.run().getRange({
									start: 0,
									end: 100
								});
								var billFileObjArray = new Array();
								for (var fl = 0; fl < searchResult.length; fl++) {
									var fileInternalid = searchResult[fl].getValue({
										name: 'internalid', 
										join: 'file'
									});
									log.debug('fileInternalid',fileInternalid);
									if(!isEmpty(fileInternalid)){
										billFileObjArray[fl] = file.load({
											id: fileInternalid
										});
									}
								}

								if(!isEmpty(billFileObjArray)){
									var billFile = billFileObjArray;
								}else{
									var billFile = render.transaction({entityId : recId,printMode : render.PrintMode.PDF});
									billFile = [billFile];
								}
								log.debug('emailauthor',emailauthor);
								log.debug('tableData',tableData);
								log.debug('billFile',billFile);
								log.debug('documentNumber',documentNumber);

								if(!isEmpty(emailauthor) && !isEmpty(documentNumber) && !isEmpty(billFile) && !isEmpty(suiteletUrl)){
									var emailUrl = suiteletUrl+"&recId="+recId+"&approver="+firstApprover;
									sendEmail(emailauthor,firstApprover,documentNumber,firstApproverText,billFile,emailUrl,isEdited,passcode[firstApprover],tableData);									
								}
								}
						}
						else{
							if (scriptContext.UserEventType.EDIT && isEdited == true && (isEmpty(firstApprover)||firstApprover == '' || firstApprover == null)){
								billRecObj.setValue({fieldId: 'approvalstatus',value: '1' });
								var recordSaved = billRecObj.save({ignoreMandatoryFields:true});
								log.debug('recordSaved',recordSaved);
							}
						}
					}
				}
			}}
		}catch(err){
			log.error('Error occurred in After Submit',err);
		}
	}

	/**
	 * Function that sends an email
	 * 
	 */
	function sendEmail(author,mailApprover,documentNumber,mailApproverText,billFile,suiteletUrl,isEdited,passCode,ApprData){
		try{
			var html =  '<html>';
			if(!isEmpty(ApprData)){	
				html += '<head><style>table {border-collapse: collapse;border: 1px solid black;} th, td {border: 1px solid black;padding: 8px;}</style></head>';	
			}
			html += '<body>Hi '+mailApproverText+',<br/><br/>Bill - '+documentNumber+' is Pending Approval.<br/><br/>';
			if(isEdited == true){
				html += 'The Bill record is changed. Please review and Approve it again.<br/>';
			}
			html += '<b>Use the Passcode: </b>'+passCode+'<br/>';
			html += 'Please Click <a href= "'+suiteletUrl+'"> here </a> to Approve/Reject the Invoice.<br/><br/>';
			html += '<b>Note: </b> Passcode should be entered before you Submit(Approve/Reject) the form and it can be used only once.';
			//Table with Approvers	
			if(ApprData != null && ApprData != '' && ApprData != undefined){	
				html += '<br/><br/>';	
				html += ApprData;	
			}
			html += '<br/><br/>Thanks.</body></html>';
			email.send({
				author: author,
				recipients : mailApprover,
				subject : 'Bill - '+documentNumber+' is pending approval.',
				body : html,
				attachments : billFile
			});
			log.debug('Email sent','document Number - '+documentNumber);
		}catch(e){
			log.error('Error Occured in email sending part',e);
		}
	}

	function getFileId(fileName) {
		try{
			var internalId = '';
			var searchObject = search.create({
				type: search.Type.FOLDER,
				columns : [{name : 'internalid',join : 'file'}],
				filters : [{name:'name',join:'file',operator:'is',values:fileName}]
			});

			if( searchObject != null && searchObject != '' && searchObject != undefined){
				var searchResults = searchObject.run().getRange({start : 0,end : 1});
				if(searchResults.length>=1){
					internalId = searchResults[0].getValue({name : 'internalid',join : 'file'});
				}
			}
		}catch(err) {
			log.error("Error during getFileId", err);
			internalId = '';
		}
		return internalId;
	}
	return {
		beforeLoad: beforeLoad,
		beforeSubmit: beforeSubmit,
		afterSubmit: afterSubmit
	};

});



/**
 * Function checks whether a string is empty
 * 
 * @param {string} stValue - string to be evaluated
 * @return {boolean} true if string is empty
 */
function isEmpty(stValue) {
	return ((stValue === '' || stValue == null || stValue == undefined)
			|| (stValue.constructor === Array && stValue.length == 0) || (stValue.constructor === Object && (function(
					v) {
				for ( var k in v)
					return false;
				return true;
			})(stValue)));
}