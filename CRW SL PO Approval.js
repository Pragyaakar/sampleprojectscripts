/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record','N/url','N/search','N/render','N/email','N/redirect'],

		function(record,url,search,render,email,redirect) {

	/**
	 * Definition of the Suitelet script trigger point.
	 *
	 * @param {Object} context
	 * @param {ServerRequest} context.request - Encapsulation of the incoming request
	 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
	 * @Since 2015.2
	 */
	/***********Global Variables*************/
	var expenseCustomForm  = 498;//137
	var funExpenseForm     = 484;//134
	var funInventoryForm   = 499;//135
	var suiteletCalled     = ['customscript_crw_sl_po_approval_process','customdeploy_crw_sl_po_approval_process'];
	var approveImgFileName = 'poApproved.gif'; // GIF image name which is stored in Filecabinet
	var rejectImgFileName  = 'poReject.gif';
	var failureImgFileName = 'PoFailure.gif';
	var preloaderImage     = 'Popreloader.gif';
	/**********Global Variables*************/
	function onRequest(context) {
		try{
			var recordId       = context.request.parameters.recId;
			var action         = context.request.parameters.action;
			var emailApprover  = context.request.parameters.approver;
			var urlData        = context.request.parameters.field1;
			var recordApproval = context.request.parameters.redir;
			var htmlPasscode   = context.request.parameters.PassCode;
			var rejComments    = context.request.parameters.Comments;
			var userRole       = context.request.parameters.role;
			var costCenter     = context.request.parameters.costcenter;
			log.debug('emailApprover- '+emailApprover,'action- '+action);
			log.debug('urlData-'+urlData,'recordApproval- '+recordApproval+', costCenter-'+costCenter);

			var suiteletUrl     = url.resolveScript({scriptId: suiteletCalled[0],deploymentId: suiteletCalled[1],returnExternalUrl: true});


			var poRec = record.load({type : record.Type.PURCHASE_ORDER,id : recordId});
			var itemLines           = poRec.getLineCount({sublistId: 'item'});
			var expenseLines        = poRec.getLineCount({sublistId: 'expense'});
			var documentNumber      = poRec.getValue({fieldId : 'tranid'                     });
			var vendor              = poRec.getText({ fieldId : 'entity'                     });
			var total               = poRec.getText({ fieldId : 'total'                      });
			var approvedByText      = poRec.getText({ fieldId : 'custbody_last_approved_by'  });
			var poCreator           = poRec.getValue({fieldId : 'custbody_createdby'         });
			var poCreatorText       = poRec.getText({ fieldId : 'custbody_createdby'         }); 
			var currentApprover     = poRec.getValue({fieldId : 'custbody_crw_next_approver' });
			var currentApproverText = poRec.getText({ fieldId : 'custbody_crw_next_approver' });
			var customForm          = poRec.getValue({fieldId : 'customform'                 });
			var firstApprover       = poRec.getValue({fieldId : 'custbody7'                  });
			var secondApprover      = poRec.getValue({fieldId : 'custbody8'                  });
			var thirdApprover       = poRec.getValue({fieldId : 'custbody9'                  });
			var fourthApprover      = poRec.getValue({fieldId : 'custbody10'                 });
			//var fifthApprover       = poRec.getValue({fieldId : 'custbody_crw_fifth_approver'});
			var firstApproverText   = poRec.getText({ fieldId : 'custbody7'                  });
			var secondApproverText  = poRec.getText({ fieldId : 'custbody8'                  });
			var thirdApproverText   = poRec.getText({ fieldId : 'custbody9'                  });
			var fourthApproverText  = poRec.getText({ fieldId : 'custbody10'                 });
			//var fifthApproverText   = poRec.getText({ fieldId : 'custbody_crw_fifth_approver'});
			var stage               = poRec.getValue({fieldId : 'custbody_stage'             });
			var approvedBy          = poRec.getValue({fieldId : 'custbody_approved_by'       });
			var rejectedBy          = poRec.getValue({fieldId : 'custbody_rejected_by'       });
			var recPasscode         = poRec.getValue({fieldId : 'custbody_crw_po_appr_passcode'});
			var isEdited            = poRec.getValue({fieldId :'custbody_crw_po_approval_edited'});
			var skippedApprovers    = poRec.getValue({fieldId : 'custbody_crw_approvers_skipped'});
			var editedNumber        = Number(poRec.getValue({fieldId : 'custbody_crw_po_edited_number'}));	
			var recCostCenter       = poRec.getText({fieldId:'department'});	
			var memo                = poRec.getValue({fieldId:'memo'});
			var nextApprover        = '';
			var nextApproverText    = '';
			var actionPerformed     = '';
			var result              = 'failed';
			log.debug('customForm',customForm);

			if( recPasscode != null && recPasscode != '' && recPasscode != undefined){
				recPasscode = JSON.parse(recPasscode);
				if(htmlPasscode != null && htmlPasscode != '' && htmlPasscode != undefined){
					log.debug('Passcode on Record - '+recPasscode[emailApprover], 'submitted Passcode - '+htmlPasscode);
					if(recPasscode[emailApprover] != htmlPasscode){
						context.response.write('Incorrect Passcode');
						return;
					}
				}
			}
			log.debug('stage- '+stage,'emailApprover-'+emailApprover+', userRole-'+userRole);

			if((urlData != '' && urlData != null && urlData != undefined) || (costCenter != '' && costCenter != null && costCenter != undefined)){
				try{
					var approvedLines = '';
					var rejectedLines = '';
					if(urlData != '' && urlData != null && urlData != undefined){
						urlData       = JSON.parse(urlData);
						approvedLines = urlData['approved'];
						rejectedLines = urlData['rejected'];
					}else if(costCenter != '' && costCenter != null && costCenter != undefined){
						var linestobeApproved = new Array();
						if(itemLines>0){
							for(var j=0;j<itemLines;j++){
								var lineCostCenter = poRec.getSublistValue({sublistId:'item',fieldId:'department',line:j});
								var lineApproved   = Number(poRec.getSublistValue({sublistId:'item',fieldId:'custcol_crw_approved',line:j}));
								if(lineCostCenter == costCenter && lineApproved == Number(2)){
									linestobeApproved.push(j);
								}
							}
						}else if(expenseLines > 0){
							for(var j=0;j<expenseLines;j++){
								var lineCostCenter = poRec.getSublistValue({sublistId:'expense',fieldId:'department',line:j});
								var lineApproved   = Number(poRec.getSublistValue({sublistId:'expense',fieldId:'custcol_crw_approved',line:j}));
								if(lineCostCenter == costCenter && lineApproved == Number(2)){
									linestobeApproved.push(j);
								}
							}
						}
						log.debug('linestobeApproved - '+linestobeApproved);
						if(linestobeApproved.length > 0){
							if(action == 'approve'){
								approvedLines = linestobeApproved;
							}else if(action == 'reject'){
								rejectedLines = linestobeApproved;
							}
						}
					}
					if( rejectedLines.length>0){
						var costCenterOwner = '';
						if(itemLines>0){
							for(var z=0;z<rejectedLines.length;z++){
								poRec.setSublistValue({sublistId:'item',fieldId:'custcol_crw_approved',value:4,line:rejectedLines[z]});
							}
							costCenterOwner = poRec.getSublistValue({sublistId:'item',fieldId:'custcol_crw_approver',line:rejectedLines[0]});
						}else if(expenseLines >0){
							for(var z=0;z<rejectedLines.length;z++){
								poRec.setSublistValue({sublistId:'expense',fieldId:'custcol_crw_approved',value:4,line:rejectedLines[z]});
							}
							costCenterOwner = poRec.getSublistValue({sublistId:'expense',fieldId:'custcol_crw_approver',line:rejectedLines[0]});
						}
						poRec.setValue({fieldId: 'approvalstatus'            , value: 3});
						poRec.setValue({fieldId: 'custbody_rejected_by'      , value: emailApprover});
						poRec.setValue({fieldId: 'custbody_crw_next_approver', value: ''});
						poRec.setValue({fieldId: 'custbody11'                , value: rejComments});
						actionPerformed = 'Rejected';
						delete recPasscode[costCenterOwner];
						poRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: JSON.stringify(recPasscode)});
						nextApprover = '';
						result = 'rejected';
					}else if(approvedLines.length>0){
						var count     = Number(0);
						if(itemLines>0 || expenseLines>0){
							var approversList = new Array();
							var filter        = new Array();
							filter.push(search.createFilter({name:'internalid',operator:'is',values:recordId}));
							filter.push(search.createFilter({name:'mainline',operator:'is',values:["F"]}));
							if(itemLines>0){
								filter.push(search.createFilter({name:'internalid',join:'item',operator:'noneof',values:["@NONE@"]}));
							}else if(expenseLines>0){
								filter.push(search.createFilter({name:'internalid',join:'item',operator:'anyof',values:["@NONE@"]}));
							}
							var approverSearch = search.create({
								type: search.Type.PURCHASE_ORDER,
								filters: filter,
								columns: [{name:'custcol_crw_approver',summary:'GROUP'},
									{name:'formulanumeric',summary:'SUM',formula:"CASE WHEN {custcol_crw_approved}=('Approved') THEN 1 ELSE 0 END"}]
							});
							var apprSearchResults = approverSearch.run().getRange({start:0,end:1000});
							if( apprSearchResults.length>0){
								for(var z=0;z<apprSearchResults.length;z++){
									var lineApprover = apprSearchResults[z].getValue({name:'custcol_crw_approver',summary:'GROUP'});
									if(approversList.indexOf(lineApprover) == -1){
										approversList.push(lineApprover);
										count += Number(apprSearchResults[z].getValue({name:'formulanumeric',summary:'SUM',formula:"CASE WHEN {custcol_crw_approved}=('Approved') THEN 1 ELSE 0 END"}));
									}
								}
							}
							log.debug('count- ',count);
							log.debug(typeof approversList,'approversList- '+approversList.length);
							log.debug(typeof currentApprover,'currentApprover- '+currentApprover.length);
							if((stage ==  0 && approversList.indexOf(emailApprover) != -1 && currentApprover.indexOf(emailApprover) != -1) || userRole == '3'){
								log.debug('approvedLines.length - '+approvedLines.length,'approvedLines - '+approvedLines);
								var costCenterOwner = '';
								for(var z=0;z<approvedLines.length;z++){
									if(itemLines>0){
										poRec.setSublistValue({sublistId:'item',fieldId:'custcol_crw_approved',value:3,line:approvedLines[z]});
										costCenterOwner = poRec.getSublistValue({sublistId:'item',fieldId:'custcol_crw_approver',line:approvedLines[z]});
									}else if(expenseLines>0){
										poRec.setSublistValue({sublistId:'expense',fieldId:'custcol_crw_approved',value:3,line:approvedLines[z]});
										costCenterOwner = poRec.getSublistValue({sublistId:'expense',fieldId:'custcol_crw_approver',line:approvedLines[z]});
									}
									count++;
								}
								currentApprover.splice(currentApprover.indexOf(costCenterOwner),1);
								poRec.setValue({fieldId: 'custbody_crw_next_approver', value:currentApprover});

								if((currentApprover == ''&& secondApprover == '')||(currentApprover == ''&& thirdApprover == '') && (currentApprover == ''&& fourthApprover == '')){
										poRec.setValue('approvalstatus',2);
										var status = "Approved";
										emailSent = sendEmail(emailApprover,poCreator,poCreatorText,documentNumber,recordId,status,null,null,null,null);
									log.audit("emailsent",emailsent);
									}

								if((itemLines>0 && count == itemLines) || (expenseLines>0 && count == expenseLines)){
									//all lines are approved									
									if( approversList.indexOf(secondApprover) == -1 && secondApprover != emailApprover && skippedApprovers.indexOf(secondApprover) == -1){
										nextApprover     = secondApprover;
										nextApproverText = secondApproverText
										stage = 1;
									}else if(approversList.indexOf(thirdApprover) == -1 && thirdApprover != emailApprover && skippedApprovers.indexOf(thirdApprover) == -1){
										nextApprover     = thirdApprover;
										nextApproverText = thirdApproverText;
										stage            = 2;
									}else if(approversList.indexOf(fourthApprover) == -1 && fourthApprover != emailApprover && skippedApprovers.indexOf(fourthApprover) == -1){
										nextApprover     = fourthApprover;
										nextApproverText = fourthApproverText;
										stage            = 3;
									}/*else if(approversList.indexOf(fifthApprover) == -1 && fifthApprover != emailApprover && skippedApprovers.indexOf(fifthApprover) == -1){
									nextApprover     = fifthApprover;
									nextApproverText = fifthApproverText;
									stage            = 4;
								}*/
									poRec.setValue({fieldId: 'custbody_crw_next_approver', value:nextApprover});	
								}else{	
									nextApprover = currentApprover;	
								}

								poRec.setValue({fieldId: 'custbody_stage'            , value:stage         });
								poRec.setValue({fieldId: 'custbody_last_approved_by' , value: emailApprover});
								log.debug('stage-'+stage,'nextApprover-'+nextApprover);
								approvedBy.push(emailApprover);
								poRec.setValue({fieldId: 'custbody_approved_by', value: approvedBy});
								if(userRole == '3'){
									skippedApprovers.push(costCenterOwner);
									poRec.setValue({fieldId: 'custbody_crw_approvers_skipped',value:skippedApprovers});
								}
								actionPerformed = 'Approved';
								delete recPasscode[costCenterOwner];
								poRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: JSON.stringify(recPasscode)});
							}
						}
						result = 'approved';
					}

					if(rejComments != null && rejComments != '' && rejComments != undefined){
						var noteRec = record.create({type: 'note',isDynamic: true});
						noteRec.setValue({fieldId : 'title'      , value : actionPerformed});
						noteRec.setValue({fieldId : 'author'     , value : emailApprover});
						noteRec.setValue({fieldId : 'transaction', value : recordId});
						noteRec.setValue({fieldId : 'note'       , value : rejComments});
						noteRec.setValue({fieldId : 'custrecord_crw_po_edited', value :editedNumber});
						noteRec.save({ignoreMandatoryFields : true});
					}
					var returnedTable = approversDataInEmail(recordId,editedNumber,customForm,recCostCenter,firstApproverText,secondApproverText,thirdApproverText,fourthApproverText/*,fifthApproverText*/,itemLines,expenseLines);

					if( nextApprover != '' && nextApprover != null && nextApprover != undefined && nextApprover != currentApprover){
						poRec.setValue({fieldId: 'custbody_crw_next_approver', value: nextApprover});
						if(emailApprover != null && emailApprover != '' && documentNumber != null && documentNumber != '' && recordId != null && recordId != '' && suiteletUrl != null && suiteletUrl != '' && recPasscode[nextApprover] != null && recPasscode[nextApprover] != ''){
							var status = 'Pending Approval';
							emailSent  = sendEmail(emailApprover,nextApprover,nextApproverText,documentNumber,recordId,status,suiteletUrl,recPasscode[nextApprover],isEdited,null,returnedTable);
						}
					}else if( result == 'rejected' || (result == 'approved' && nextApprover != currentApprover)){
						if(emailApprover != null && emailApprover != '' && poCreator != null && poCreator != '' && documentNumber != null && documentNumber != '' && recordId != null && recordId != ''){
							if(result == 'approved'){
								var status = 'Approved';
								poRec.setValue({fieldId: 'approvalstatus', value: 2});
							}else if(result == 'rejected'){
								var status = 'Rejected';
							}
							emailSent = sendEmail(emailApprover,poCreator,poCreatorText,documentNumber,recordId,status,null,null,null,rejComments,returnedTable);
						}
					}
					var savedRecId = poRec.save({ignoreMandatoryFields:true});
					log.debug('savedRecId',savedRecId);
					if( savedRecId == null || savedRecId == '' || savedRecId == undefined){
						result = 'failed';
					}
				}catch(e){
					log.error('Error Occured while approving the Custom form in stage 0 for record: '+recordId,e);
					result = 'failed';
				}
				if( recordApproval == 'redir'){
					if(recordId != null && recordId != '' && recordId!= undefined){
						redirect.toRecord({type : record.Type.PURCHASE_ORDER, id : recordId});
					}else{
						context.response.write('Unexpected Error. Please Contact your administrator.');
					}
				}else{
					log.debug('result',result);
					context.response.write(result);
					return;
				}
			}else if(action == 'approve'){
				try{
					var emailSent = false;
					/*if(stage == 4 && (emailApprover == fifthApprover || userRole == '3')){
					//5th approver has clicked the approve button. There are no further approvers, PO status will be changes to approved
					poRec.setValue({fieldId: 'custbody_stage'            , value:'5'      });
					poRec.setValue({fieldId: 'custbody_last_approved_by' , value: emailApprover});
					poRec.setValue({fieldId: 'custbody_crw_next_approver', value: ''      });
					approvedBy.push(emailApprover);
					poRec.setValue({fieldId: 'custbody_approved_by', value: approvedBy});
					delete recPasscode[fifthApprover];
					poRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: JSON.stringify(recPasscode)});
					if(userRole == '3'){
						skippedApprovers.push(fifthApprover);
						poRec.setValue({fieldId: 'custbody_crw_approvers_skipped',value:skippedApprovers});
					}
					nextApprover = '';
				}else*/ if(stage == 3 && (emailApprover == fourthApprover || userRole == '3')){/*
					if(approvedBy.indexOf(fifthApprover) == -1 && fifthApprover != emailApprover && skippedApprovers.indexOf(fifthApprover) == -1){
						nextApprover     = fifthApprover;
						nextApproverText = fifthApproverText;
						stage            = 4;
					}
					log.debug('nextApprover'+nextApprover);
					poRec.setValue({fieldId: 'custbody_stage'            , value:stage        });
					poRec.setValue({fieldId: 'custbody_last_approved_by' , value: emailApprover});
					poRec.setValue({fieldId: 'custbody_crw_next_approver', value: nextApprover});
					approvedBy.push(emailApprover);
					poRec.setValue({fieldId: 'custbody_approved_by', value: approvedBy});
					if(userRole == '3'){
						skippedApprovers.push(fourthApprover);
						poRec.setValue({fieldId: 'custbody_crw_approvers_skipped',value:skippedApprovers});
					}
					delete recPasscode[fourthApprover];
					poRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: JSON.stringify(recPasscode)});
				 */

					//4th approver has clicked the approve button. There are no further approvers, PO status will be changes to approved
					poRec.setValue({fieldId: 'custbody_stage'            , value:'4'      });
					poRec.setValue({fieldId: 'custbody_last_approved_by' , value: emailApprover});
					poRec.setValue({fieldId: 'custbody_crw_next_approver', value: ''      });
					approvedBy.push(emailApprover);
					poRec.setValue({fieldId: 'custbody_approved_by', value: approvedBy});
					delete recPasscode[fourthApprover];
					poRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: JSON.stringify(recPasscode)});
					if(userRole == '3'){
						skippedApprovers.push(fourthApprover);
						poRec.setValue({fieldId: 'custbody_crw_approvers_skipped',value:skippedApprovers});
					}
					nextApprover = '';
				}else if(stage == 2  && (emailApprover == thirdApprover || userRole == '3')){
					if(approvedBy.indexOf(fourthApprover) == -1 && fourthApprover != emailApprover && skippedApprovers.indexOf(fourthApprover) == -1){
						nextApprover     = fourthApprover;
						nextApproverText = fourthApproverText;
						stage            = 3;
					}/*else if(approvedBy.indexOf(fifthApprover) == -1 && fifthApprover != emailApprover && skippedApprovers.indexOf(fifthApprover) == -1){
						nextApprover     = fifthApprover;
						nextApproverText = fifthApproverText;
						stage            = 4;
					}*/
					poRec.setValue({fieldId: 'custbody_stage'            , value:stage        });
					poRec.setValue({fieldId: 'custbody_last_approved_by' , value: emailApprover});
					poRec.setValue({fieldId: 'custbody_crw_next_approver', value: nextApprover});
					approvedBy.push(emailApprover);
					poRec.setValue({fieldId: 'custbody_approved_by', value: approvedBy});
					if(userRole == '3'){
						skippedApprovers.push(thirdApprover);
						poRec.setValue({fieldId: 'custbody_crw_approvers_skipped',value:skippedApprovers});
					}
					delete recPasscode[thirdApprover];
					poRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: JSON.stringify(recPasscode)});

				}else if(stage == 1 && (emailApprover == secondApprover || userRole == '3')){
					if(approvedBy.indexOf(thirdApprover) == -1 && thirdApprover != emailApprover && skippedApprovers.indexOf(thirdApprover) == -1){ //email approver can be administrator
						nextApprover     = thirdApprover;
						nextApproverText = thirdApproverText;
						stage            = 2;
					}else if(approvedBy.indexOf(fourthApprover) == -1 && fourthApprover != emailApprover && skippedApprovers.indexOf(fourthApprover) == -1){
						nextApprover     = fourthApprover;
						nextApproverText = fourthApproverText;
						stage            = 3;
					}/*else if(approvedBy.indexOf(fifthApprover) == -1 && fifthApprover != emailApprover && skippedApprovers.indexOf(fifthApprover) == -1){
						nextApprover     = fifthApprover;
						nextApproverText = fifthApproverText;
						stage            = 4;
					}*/
					poRec.setValue({fieldId: 'custbody_stage'            , value:stage        });
					poRec.setValue({fieldId: 'custbody_last_approved_by' , value: emailApprover});
					poRec.setValue({fieldId: 'custbody_crw_next_approver', value: nextApprover});
					approvedBy.push(emailApprover);
					poRec.setValue({fieldId: 'custbody_approved_by', value: approvedBy});
					if(userRole == '3'){
						skippedApprovers.push(secondApprover);
						poRec.setValue({fieldId: 'custbody_crw_approvers_skipped',value:skippedApprovers});
					}
					delete recPasscode[secondApprover];
					poRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: JSON.stringify(recPasscode)});
				}else if((stage ==  0 && expenseCustomForm != customForm && emailApprover == firstApprover) || (expenseCustomForm != customForm && stage ==  0 && userRole == '3')){
					if( firstApprover ==  secondApprover || emailApprover == secondApprover){
						if(firstApprover == thirdApprover || emailApprover == thirdApprover){
							if(firstApprover == fourthApprover || emailApprover == fourthApprover){
								/*if(firstApprover == fifthApprover || emailApprover == fifthApprover){
									nextApprover     = '';
									nextApproverText = '';
									stage            = 5;
								}else{
									nextApprover     = fifthApprover;
									nextApproverText = fifthApproverText;
									stage            = 4;
								}*/
								nextApprover     = '';
								nextApproverText = '';
								stage            = 4;
							}else{
								nextApprover     = fourthApprover;
								nextApproverText = fourthApproverText;
								stage            = 3;
							}
						}else{
							nextApprover     = thirdApprover;
							nextApproverText = thirdApproverText;
							stage            = 2;
						}
					}else{
						nextApprover     = secondApprover;
						nextApproverText = secondApproverText;
						stage            = 1;
					}
					poRec.setValue({fieldId: 'custbody_stage'            , value:stage        });
					poRec.setValue({fieldId: 'custbody_last_approved_by' , value: emailApprover});
					poRec.setValue({fieldId: 'custbody_crw_next_approver', value: nextApprover});
					approvedBy.push(emailApprover);
					poRec.setValue({fieldId: 'custbody_approved_by', value: approvedBy});
					if(userRole == '3'){
						skippedApprovers.push(firstApprover);
						poRec.setValue({fieldId: 'custbody_crw_approvers_skipped',value:skippedApprovers});
					}
					delete recPasscode[firstApprover];
					poRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: JSON.stringify(recPasscode)});
				}
				// Add a Note
				if(rejComments != null && rejComments != '' && rejComments != undefined){
					var noteRec = record.create({type: 'note',isDynamic: true});
					noteRec.setValue({fieldId : 'title'      , value : 'Approved'});
					noteRec.setValue({fieldId : 'author'     , value : emailApprover});
					noteRec.setValue({fieldId : 'transaction', value : recordId});
					noteRec.setValue({fieldId : 'note'       , value : rejComments});
					noteRec.setValue({fieldId : 'custrecord_crw_po_edited', value :editedNumber});
					noteRec.save({ignoreMandatoryFields : true});
				}
				//search on usernotes
				var returnedTable = approversDataInEmail(recordId,editedNumber,customForm,recCostCenter,firstApproverText,secondApproverText,thirdApproverText,fourthApproverText/*,fifthApproverText*/,itemLines,expenseLines);
				if( nextApprover != '' && nextApprover != null && nextApprover != undefined){
					if(emailApprover != null && emailApprover != '' && documentNumber != null && documentNumber != '' && recordId != null && recordId != '' && suiteletUrl != null && suiteletUrl != '' && recPasscode[nextApprover] != null && recPasscode[nextApprover] != '' ){
						var status = 'Pending Approval';
						emailSent  = sendEmail(emailApprover,nextApprover,nextApproverText,documentNumber,recordId,status,suiteletUrl,recPasscode[nextApprover],isEdited,null,returnedTable);
					}
				}else{
					//If First approver and fourthApprover are same, then there's no to send the mail again to fourth approver since ha had already approved it in 1st stage, so we will approve it as there are no further approvers
					poRec.setValue({fieldId: 'approvalstatus', value: 2});
					if(emailApprover != null && emailApprover != '' && poCreator != null && poCreator != '' && documentNumber != null && documentNumber != '' && recordId != null && recordId != '' ){
						var status = 'Approved';
						emailSent = sendEmail(emailApprover,poCreator,poCreatorText,documentNumber,recordId,status,null,null,null,null,returnedTable);
					}
				}
				var savedRecId = poRec.save({ignoreMandatoryFields:true});
				log.debug('savedRecId',savedRecId);
				if( savedRecId == null || savedRecId == '' || savedRecId == undefined || emailSent != true){
					result = 'failed';
				}else{
					result = 'approved';
				}
				}catch(e){
					log.error('Error occured in Approving part for PO:'+recordId,e);
					result = 'failed';
				}
				if( recordApproval == 'redir'){
					if(recordId != null && recordId != '' && recordId!= undefined){
						redirect.toRecord({type : record.Type.PURCHASE_ORDER, id : recordId});
					}else{
						context.response.write('Unexpected Error. Please Contact your administrator.');
					}
				}else{
					log.debug('result',result);
					context.response.write(result);
					return;
				}
			}else if( action == 'reject'){
				try{
					poRec.setValue({fieldId: 'approvalstatus'               ,value: 3});
					poRec.setValue({fieldId: 'custbody_rejected_by'         ,value: emailApprover});
					poRec.setValue({fieldId: 'custbody_crw_next_approver'   ,value: ''});
					poRec.setValue({fieldId: 'custbody11'                   ,value: rejComments});
					poRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: ''});
					//Add a note
					if(rejComments != null && rejComments != '' && rejComments != undefined){
						var noteRec = record.create({type: 'note',isDynamic: true});
						noteRec.setValue({fieldId : 'title'      , value : 'Rejected'});
						noteRec.setValue({fieldId : 'author'     , value : emailApprover});
						noteRec.setValue({fieldId : 'transaction', value : recordId});
						noteRec.setValue({fieldId : 'note'       , value : rejComments});
						noteRec.setValue({fieldId : 'custrecord_crw_po_edited', value :editedNumber});
						noteRec.save({ignoreMandatoryFields : true});
					}

					var returnedTable = approversDataInEmail(recordId,editedNumber,customForm,recCostCenter,firstApproverText,secondApproverText,thirdApproverText,fourthApproverText/*,fifthApproverText*/,itemLines,expenseLines);

					if(emailApprover != null && emailApprover != '' && poCreator != null &&poCreator != '' && documentNumber != null && documentNumber != '' && recordId != null && recordId != ''){
						var status = 'Rejected';
						var emailsent = sendEmail(emailApprover,poCreator,poCreatorText,documentNumber,recordId,status,null,null,null,rejComments,returnedTable);
					}else{
						result = 'mail not sent';
					}
					var savedRecId = poRec.save({ignoreMandatoryFields : true});
					if( savedRecId != null && savedRecId != '' && savedRecId != undefined && result != 'mail not sent'){
						result = 'rejected';
					}else{
						result = 'failed';
					}
				}catch(e){
					log.error('Error occured while rejecting the PO id:'+ recordId,e);
					result = 'failed';
				}
				if( recordApproval == 'redir'){
					if(recordId != null && recordId != '' && recordId!= undefined){
						redirect.toRecord({type : record.Type.PURCHASE_ORDER, id : recordId});
					}else{
						context.response.write('Unexpected Error. Please Contact your administrator.');
					}
				}else{
					log.debug('result',result);
					context.response.write(result);
					return;
				}
			}else{
				var approveImageUrl = getUrl(approveImgFileName);
				var rejectImageUrl  = getUrl(rejectImgFileName);
				var FailureImageUrl = getUrl(failureImgFileName);
				var loaderImageUrl  = getUrl(preloaderImage);
				if(stage == 0 && approvedBy.indexOf(poRec.getValue({fieldId : 'custbody8'})) == -1 && poRec.getValue({fieldId : 'custbody8'}) != emailApprover){
					nextApprover     = poRec.getValue({fieldId : 'custbody8'});//2nd approver
					nextApproverText = poRec.getText({fieldId : 'custbody8'});
				}else if((stage == 1 || stage == 0) && approvedBy.indexOf(poRec.getValue({fieldId : 'custbody9'})) == -1  && poRec.getValue({fieldId : 'custbody9'}) != emailApprover){
					nextApprover     = poRec.getValue({fieldId : 'custbody9'});//3rd approver
					nextApproverText = poRec.getText({fieldId : 'custbody9'});
				}else if((stage == 2 || stage == 1 || stage == 0) && approvedBy.indexOf(poRec.getValue({fieldId : 'custbody10'})) == -1  && poRec.getValue({fieldId : 'custbody10'}) != emailApprover){
					nextApprover     = poRec.getValue({fieldId : 'custbody10'});//4th approver
					nextApproverText = poRec.getText({fieldId : 'custbody10'});
				}/*else if((stage == 3 || stage == 2 || stage == 1 || stage == 0) && approvedBy.indexOf(poRec.getValue({fieldId : 'custbody_crw_fifth_approver'})) == -1  && poRec.getValue({fieldId : 'custbody_crw_fifth_approver'}) != emailApprover){
					nextApprover     = poRec.getValue({fieldId : 'custbody_crw_fifth_approver'});//5th approver
					nextApproverText = poRec.getText({fieldId : 'custbody_crw_fifth_approver'});
				}*/
				var domainUrl   = url.resolveDomain({hostType: url.HostType.APPLICATION});	
				var poLink      = "https://"+domainUrl+url.resolveRecord({recordType: 'purchaseorder',recordId: recordId});

				var xhtml  = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"><html><head>';
				xhtml += '<meta charset="utf-8">';
				xhtml += '<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">';
				xhtml += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">';
				xhtml += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';
				xhtml += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>';
				xhtml += '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>';
				xhtml += '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>'; //$("#myModal").modal("show");
				xhtml += '<style>.pre-loader {position: fixed;left: 0px;top: 0px;width: 100%;height: 100%;z-index: 9999;background: url("'+loaderImageUrl+'") center no-repeat #fff;opacity: 0.5;filter: alpha(opacity=50);}.modal {top: 25%;}</style>';
				xhtml += '<script>function linesAction(){var id=event.target.id;var lines=$("#linetable tr").length;if(lines>0){var jsonData={"approved":[],"rejected":[]};var table = document.getElementById("linetable");if(id == "approveall"){for(var i=1;i<lines;i++){var Id = table.rows[i].cells[0].id;$("#all_"+Id).removeClass("fa fa-exclamation-triangle");$("#all_"+Id).removeClass("fa fa-close");$("#all_"+Id).addClass("fa fa-check");$("#all_"+Id).css("color","green");jsonData["approved"].push(Id);}';
				xhtml += '}else if(id == "rejectall"){for(var i=1;i<lines;i++){var Id = table.rows[i].cells[0].id;$("#all_"+Id).removeClass("fa fa-exclamation-triangle");$("#all_"+Id).removeClass("fa fa-check");$("#all_"+Id).addClass("fa fa-close");$("#all_"+Id).css("color","red");jsonData["rejected"].push(Id);}}$("#jsondata").val(JSON.stringify(jsonData));}}</script>';
				xhtml += '<script>function approvePO(){var passCode = $("#passcode").val();var Comment = $("#comments").val();if(passCode != null && passCode != "" && passCode != undefined){$("#preloader").addClass("pre-loader");$.ajax({url: "'+suiteletUrl+'",type: "POST",data:{action:"approve",recId:'+recordId+',approver:'+emailApprover+',PassCode:passCode,Comments:Comment},success: function(response){$("#preloader").removeClass("pre-loader");if(response=="Incorrect Passcode"){alert("Incorrect Passcode.");}else{ if(response=="approved"){$("#approveimg").css("display","block");}else{$("#failureimg").css("display","block");}$("#imgblock").show();$("#mainblock").hide();}}});}else{alert("Please Enter Passcode.");}}</script>';
				xhtml += '<script>function rejectPO(){var passCode = $("#passcode").val();var Comment = $("#comments").val();if(Comment != null && Comment != "" && Comment != undefined){if(passCode != null && passCode != "" && passCode != undefined){$("#preloader").addClass("pre-loader");$.ajax({url: "'+suiteletUrl+'",type: "POST",data:{action:"reject",recId:'+recordId+',approver:'+emailApprover+',PassCode:passCode,Comments:Comment},success: function(response){$("#preloader").removeClass("pre-loader");if(response=="Incorrect Passcode"){alert("Incorrect Passcode.");}else{if(response=="rejected"){$("#rejectimg").css("display","block");}else{$("#failureimg").css("display","block");}$("#imgblock").show();$("#mainblock").hide();}}});}else{alert("Please Enter Passcode.");}}else{alert("Please enter comments to reject the purchase order.");}}</script>';
				xhtml += '<script>function modalFunc(){var Comment=$("#comments").val();if(Comment== null||Comment==""||Comment==undefined){alert("Please enter comments to reject the purchase order.");}else{var data1=$("#jsondata").val();var passCode = $("#passcode").val();$("#preloader").addClass("pre-loader");if(data1 != null && data1 != "" && data1 != undefined){';
				xhtml += '$.ajax({url: "'+suiteletUrl+'",type: "POST",data:{field1:data1,recId:'+recordId+',approver:'+emailApprover+',PassCode:passCode,Comments:comments},success: function(response){$("#preloader").removeClass("pre-loader");if(response=="Incorrect Passcode"){alert("Incorrect Passcode.");}else{';
				xhtml += 'if(response == "rejected"){$("#rejectimg").css("display","block");}else if(response == "approved"){$("#approveimg").css("display","block");}else{$("#failureimg").css("display","block");	}$("#imgblock").show();$("#mainblock").hide();}}});';
				xhtml += '}else if(data1 == null || data1 == "" || data1 == undefined){$.ajax({url: "'+suiteletUrl+'",type: "POST",data:{action:"reject",recId:'+recordId+',approver:'+emailApprover+',PassCode:passCode,Comments:comments},success: function(response){$("#preloader").removeClass("pre-loader");';
				xhtml += 'if(response=="Incorrect Passcode"){alert("Incorrect Passcode.");}else{if(response=="rejected"){$("#rejectimg").css("display","block");}else{$("#failureimg").css("display","block");}$("#imgblock").show();$("#mainblock").hide();}}});}}}</script>';
				xhtml += '<script>function approved(){var id=(event.target.id).split("_")[1];$("#all_"+id).removeClass("fa fa-exclamation-triangle");$("#all_"+id).removeClass("fa fa-close");$("#all_"+id).addClass("fa fa-check");$("#all_"+id).css("color","green");';
				xhtml += 'var jsonData=$("#jsondata").val();if(jsonData!= null &&jsonData != ""){var jsonData=JSON.parse(jsonData);if(jsonData["rejected"] != null &&jsonData["rejected"] != "" && jsonData["rejected"] != undefined){';
				xhtml += 'if(jsonData["rejected"].length>0){if(jsonData["rejected"].indexOf(id)!=-1){jsonData["rejected"].splice([jsonData["rejected"].indexOf(id)],1);}if(jsonData["approved"].indexOf(id)==-1){jsonData["approved"].push(id);}}else{if(jsonData["approved"].indexOf(id)==-1){jsonData["approved"].push(id);}}}else{if(jsonData["approved"].indexOf(id)==-1){jsonData["approved"].push(id);}}}else{var jsonData={"approved":[],"rejected":[]};jsonData["approved"].push(id);}$("#jsondata").val(JSON.stringify(jsonData));}</script>';
				xhtml += '<script>function rejected(){var id=(event.target.id).split("_")[1];$("#all_"+id).removeClass("fa fa-exclamation-triangle");$("#all_"+id).removeClass("fa fa-check");$("#all_"+id).addClass("fa fa-close");$("#all_"+id).css("color","red");';
				xhtml += 'var jsonData=$("#jsondata").val();if(jsonData != null &&jsonData != ""){var jsonData=JSON.parse(jsonData);if(jsonData["approved"] != null &&jsonData["approved"] != "" && jsonData["approved"] != undefined){';
				xhtml += 'if(jsonData["approved"].length>0){if(jsonData["approved"].indexOf(id)!=-1){ jsonData["approved"].splice([jsonData["approved"].indexOf(id)],1);}if(jsonData["rejected"].indexOf(id)==-1){jsonData["rejected"].push(id);}}else{if(jsonData["rejected"].indexOf(id)==-1){jsonData["rejected"].push(id);}}}else{if(jsonData["rejected"].indexOf(id)==-1){jsonData["rejected"].push(id);}}}else{var jsonData = {"approved":[],"rejected":[]};jsonData["rejected"].push(id);}$("#jsondata").val(JSON.stringify(jsonData));}</script>';
				xhtml += '<script>function submitButton(){var passCode = $("#passcode").val();var Comment = $("#comments").val();var flag    = true;if(passCode != null && passCode != "" && passCode != undefined){var lines=$("#linetable tr").length;var data1=$("#jsondata").val();if(data1 != null && data1 != "" && data1 != undefined){';
				xhtml += 'var parsedata=JSON.parse(data1);if((lines-1) != (parsedata["approved"].length+parsedata["rejected"].length)){alert("Please Approve/Reject all the lines.");}else{if(parsedata["rejected"].length>0){if(Comment == null || Comment == "" || Comment == undefined){alert("Please enter comments to reject the purchase order.");flag = false;}}';
				xhtml += 'if(flag == true){$("#preloader").addClass("pre-loader");$.ajax({url: "'+suiteletUrl+'",type: "POST",data:{field1:data1,recId:'+recordId+',approver:'+emailApprover+',PassCode:passCode,Comments:Comment},success: function(response){$("#preloader").removeClass("pre-loader");if(response=="Incorrect Passcode"){alert("Incorrect Passcode.");}else{if(response == "rejected"){$("#rejectimg").css("display","block");}else if(response=="approved"){$("#approveimg").css("display","block");}else{$("#failureimg").css("display","block");}$("#imgblock").show();$("#mainblock").hide();}}});}}}else{alert("Please Select atleast one line to Approve/Reject.");}}else{alert("Please Enter Passcode.");}}</script>';
				xhtml += '</head><body><center><div id="preloader"></div><div class="modal fade" id="myModal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-body"><b>Rejected Comments</b><center><textarea id="commentsId" style="width: 300px;"></textarea></center>';
				xhtml += '</br><button type="button" id="add_comment" style="float:right;" class="button small" data-dismiss="modal" onclick="modalFunc()">SUBMIT</button><br/></div></div></div></div>';
				xhtml += '<div id="imgblock" class="row" style="width:400px;margin-top:15%; margin-right:0px;margin-left:0px;display:none">';
				if(approveImageUrl != '' && rejectImageUrl != '' && FailureImageUrl != ''){
					xhtml += '<p id="approveimg" style="display:none">PO - '+documentNumber+' is Approved.<br/><img src='+ approveImageUrl + ' style= "width:200px;height:200px"></p>';
					xhtml += '<p id="rejectimg"  style="display:none">PO - '+documentNumber+' is Rejected.<br/><img src='+ rejectImageUrl + ' style= "width:200px;height:200px"></p>';
					xhtml += '<p id="failureimg" style="display:none">Status of PO - '+documentNumber+' is not changed. Please try again.<br/><img src='+ FailureImageUrl + ' style= "width:200px;height:200px"></p>';
				}else{
					var error = "Approve Image/Reject Image/Failure Image is null";
					log.error('Approve Image/Reject Image/Failure Image is null','Approve Image/Reject Image/Failure Image is null');
					throw error;
				}
				if(rejectedBy != null && rejectedBy != '' && rejectedBy != undefined){
					xhtml += '</div><div id="mainblock" class="row" style="width:100%;max-width:500px;margin-top:15%; margin-right:0px;margin-left:0px;">';
					xhtml += '<p id="rejectimg">PO - '+documentNumber+' is Rejected.<br/><img src='+ rejectImageUrl + ' style= "width:200px;height:200px"></p>';
				}else if(approvedBy.indexOf(emailApprover) != -1 || recPasscode[emailApprover] == null || recPasscode[emailApprover] == '' || recPasscode[emailApprover] == undefined ){
					xhtml += '</div><div id="mainblock" class="row" style="width:100%;max-width:500px;margin-top:15%; margin-right:0px;margin-left:0px;">';
					xhtml += '<p id="approveimg">PO - '+documentNumber+' is Approved.<br/><img src='+ approveImageUrl + ' style= "width:200px;height:200px"></p>';
				}else if(approvedBy.indexOf(emailApprover) == -1){
					xhtml += '</div><div id="mainblock" class="row" style="width:100%;max-width:500px; margin-top:3%;margin-right:0px;margin-left:0px;">';
					xhtml += '<div><div class="col-xs-12" style="background-color:white;"><h2>Purchase Order</h2></div></br>';
					xhtml += '<div class="col-xs-12" style="background-color:white;">PO - '+documentNumber+' is Pending Approval.</div></br></br></br>';
					xhtml += '<div style="height:15px;"></div>';
					xhtml += '<input type="textarea" id="jsondata" style="display:none">';
					xhtml += '<div class="table-responsive"><table class="table" style="margin-left : auto; margin-right : auto;"><thead><tr><th>Fields</th><th>Values</th></tr></thead>';
					xhtml += '<tbody><tr><td>Vendor</td><td>'+vendor+'</td></tr>';
					xhtml += '<tr><td>Total Amount</td><td>'+total+'</td></tr>';
					xhtml += '<tr><td>Memo</td><td>'+memo+'</td></tr>';
					xhtml += '<tr><td>Po Creator</td><td>'+poCreatorText+'</td></tr>';
					xhtml += '<tr><td>Last Approved By </td><td>'+approvedByText+'</td></tr>';
					xhtml += '<tr><td>Next Approver</td><td>'+nextApproverText+'</td></tr>';
					xhtml += '<tr><td>Record Link</td><td><a href= "'+poLink+'">Click here to View the Record.</a></td></tr>';
					xhtml += '</tbody></table>';

					if(expenseCustomForm == customForm && stage == 0 && (itemLines > 0 || expenseLines > 0)){
						xhtml += '<div style="height:15px;"></div>';
						xhtml += '<div class="table-responsive"><h5 style="text-align: left;"><b style="padding-right:70px;"><u>Item Sublist</u></b>';
						xhtml += '<button id="approveall" style="width:100px;height:25px;" onclick="linesAction()">Approve All</button>&nbsp;&nbsp;&nbsp;&nbsp;';
						xhtml += '<button id="rejectall" style="width:100px;height:25px;" onclick="linesAction()">Reject All</button></h5>';
						xhtml += '<table class="table table-bordered" id="linetable" style="border: 0px solid;">';
						if(itemLines>0){
							xhtml += '<thead><tr><th style="border-left-width: 0px;"></th><th>Item</th><th>Description</th><th>Quantity</th><th>Unit Rate</th><th>Amount</th><th style="border-right-width:0px;"></th><th style="border-left-width:0px;border-right-width:0px;"></th></tr></thead><tbody>';
							for(var j=0;j<itemLines;j++){
								var lineApprover = poRec.getSublistValue({sublistId:'item',fieldId:'custcol_crw_approver',line:j});
								if(lineApprover == emailApprover && poRec.getSublistValue({sublistId:'item',fieldId:'custcol_crw_approved',line:j}) == 2){
									xhtml += '<tr><td id="'+j+'"  style="border-left-width: 0px;"><i id="all_'+j+'" class="fa fa-exclamation-triangle" style="font-size:25px;color:yellow;border-top-width: 0px;border-right-width: 0px;"></i></td><td>'+poRec.getSublistText({sublistId:'item',fieldId:'item',line:j});+'</td>';
									xhtml += '<td>'+poRec.getSublistValue({sublistId:'item',fieldId:'custcol4',line:j});+'</td>';
									xhtml += '<td>'+poRec.getSublistValue({sublistId:'item',fieldId:'quantity',line:j});+'</td>';
									xhtml += '<td>'+poRec.getSublistValue({sublistId:'item',fieldId:'rate',line:j});+'</td>';
									xhtml += '<td>'+poRec.getSublistValue({sublistId:'item',fieldId:'amount',line:j});+'</td>';
									xhtml += '<td style="border-right-width:0px;"><button id="item_'+j+'" style="padding:0.5px 8px;background-color:#72ed90" onclick="approved()" class="fa fa-check"></button></td>';
									xhtml += '<td style="border-left-width:0px;border-right-width:0px;"><button id="item_'+j+'" style="padding:0.5px 8px;background-color:#f29288" onclick="rejected()" class="fa fa-close"></button></td></tr>';
								}
							}
						}else if(expenseLines > 0){
							xhtml += '<thead><tr><th style="border-left-width: 0px;"></th><th>Account</th><th>Amount</th><th style="border-right-width:0px;"></th><th style="border-left-width:0px;border-right-width:0px;"></th></tr></thead><tbody>';
							for(var j=0;j<expenseLines;j++){
								var lineApprover = poRec.getSublistValue({sublistId:'expense',fieldId:'custcol_crw_approver',line:j});
								if(lineApprover == emailApprover && poRec.getSublistValue({sublistId:'expense',fieldId:'custcol_crw_approved',line:j}) == 2){
									xhtml += '<tr><td id="'+j+'" style="border-left-width: 0px;"><i id="all_'+j+'" class="fa fa-exclamation-triangle" style="font-size:25px;color:yellow;border-top-width: 0px;border-right-width: 0px;"></i></td><td>'+poRec.getSublistText({sublistId:'expense',fieldId:'account',line:j});+'</td>';
									xhtml += '<td>'+poRec.getSublistValue({sublistId:'expense',fieldId:'amount',line:j});+'</td>';
									xhtml += '<td style="border-right-width:0px;"><button id="exp_'+j+'" style="padding:0.5px 8px;background-color:#72ed90" onclick="approved()" class="fa fa-check"></button></td>';
									xhtml += '<td style="border-left-width:0px;border-right-width:0px;"><button id="exp_'+j+'" style="padding:0.5px 8px;background-color:#f29288" onclick="rejected()" class="fa fa-close"></button></td></tr>';
								}
							}
						}

						xhtml += '</tbody></table></div><div style="padding:15px;"></div>';
						xhtml += '<div><table class="table" style="border: none !important;"><tbody><tr><td style="border: none !important;"><label for="comments">Enter Comments:</label></td><td style="border: none !important;"><textarea name="Comments" id="comments" style="width:70%"></textarea></td></tr>';
						xhtml += '<tr><td style="border: none !important;"><label for="passcode">Enter Passcode:</label></td><td style="border: none !important;"><input type="text" id="passcode" style="width:70%"></td></tr></tbody></table></div>';
						xhtml += '<button style="padding:5px 20px;" onclick="submitButton();">Submit</button>';
					}else{
						xhtml += '<div class="table-responsive"><h5 style="text-align: left;"><b style="padding-right:70px;"><u>Item Sublist</u></b><div style="height:15px;"></div>';
						xhtml += '<table class="table table-bordered" id="linetable" >'; //style="border: 0px solid;"
						if(itemLines>0){
							xhtml += '<thead><tr><th>Item</th><th>Description</th><th>Quantity</th><th>Unit Rate</th><th>Amount</th></tr></thead><tbody>';
							for(var j=0;j<itemLines;j++){
								xhtml += '<tr><td>'+poRec.getSublistText({sublistId:'item',fieldId:'item',line:j});+'</td>';
								if(customForm == funExpenseForm){
									xhtml += '<td>'+poRec.getSublistValue({sublistId:'item',fieldId:'custcol4',line:j});+'</td>';
								}else{
									xhtml += '<td>'+poRec.getSublistValue({sublistId:'item',fieldId:'description',line:j});+'</td>';
								}
								xhtml += '<td>'+poRec.getSublistValue({sublistId:'item',fieldId:'quantity',line:j});+'</td>';
								xhtml += '<td>'+poRec.getSublistValue({sublistId:'item',fieldId:'rate',line:j});+'</td>';
								xhtml += '<td>'+poRec.getSublistValue({sublistId:'item',fieldId:'amount',line:j});+'</td></tr>';
							}
						}else if(expenseLines > 0){
							xhtml += '<thead><tr><th>Account</th><th>Amount</th></tr></thead><tbody>';
							for(var j=0;j<expenseLines;j++){
								xhtml += '<tr><td>'+poRec.getSublistText({sublistId:'expense',fieldId:'account',line:j});+'</td>';
								xhtml += '<td>'+poRec.getSublistValue({sublistId:'expense',fieldId:'amount',line:j});+'</td></tr>';
							}
						}
						xhtml += '</tbody></table></div>';
						// xhtml += '<br><table class="table" style="border: none !important;"><tbody><tr><td style="border: none !important;"><label for="passcode">Enter Passcode:</label></td><td><input type="text" id="passcode"></td></tr></tbody></table><br><br>';
						xhtml += '<div><table class="table" style="border: none !important;"><tbody><tr><td style="border: none !important;"><label for="comments">Enter Comments:</label></td><td style="border: none !important;"><textarea name="Comments" id="comments" style="width:70%"></textarea></td></tr>';
						xhtml += '<tr><td style="border: none !important;"><label for="passcode">Enter Passcode:</label></td><td style="border: none !important;"><input type="text" id="passcode" style="width:70%"></td></tr>';
						xhtml += '<tr><td style="border: none !important;"><button style="width:100px;height:35px;" onclick="approvePO()" >Approve</button></td>';
						xhtml += '<td style="border: none !important;"><button style="width:100px;height:35px;" onclick="rejectPO()">Reject</button></td></tr></tbody></table></div>';

						/*xhtml += '<tr><td style="border: none !important;" ></td></tr><tr><td style="border: none !important;"><label for="passcode">Enter Passcode:</label></td>';
				xhtml += '<td style="border: none !important;"><input type="text" id="passcode"></td></tr></tbody></table>';
				xhtml += '<div style="height:15px;"></div>';*/
					}
				}else{
					xhtml += '<p id="failureimg">Status of PO - '+documentNumber+' is not changed. Please try again.<br/><img src='+ FailureImageUrl + ' style= "width:200px;height:200px"></p>';
				}
				xhtml += '</div></div> </center></body></html>';
				context.response.write(xhtml);

				//xhtml += '<script>function approvePO(){var test = window.open("'+approveUrl+'","_self");}</script>';
				//xhtml += '<script>function rejectPO(){window.open("'+rejectUrl+'","_self");}</script>';
				/*style="margin-left:500px !important;margin-top:50px;position:fixed;"*/
			}
		}catch(ERR){
			log.error('Error occured while showing the for to approve the PO',ERR);
			context.response.write("Unexpected Error, Please contact your administrator");
		}
	}

	function getUrl(fileName) {
		try{
			var url = '';
			var searchObject = search.create({
				type: search.Type.FOLDER,
				columns : [{name : 'url',join : 'file'}],
				filters : [{name:'name',join:'file',operator:'is',values:fileName}]
			});

			if( searchObject != null && searchObject != '' && searchObject != undefined){
				var searchResults = searchObject.run().getRange({start : 0,end : 1});
				if(searchResults.length>=1){
					url = searchResults[0].getValue({name : 'url',join : 'file'});
				}
			}
		}catch(err) {
			log.error("Error during returnClientScriptInternalId", err);
			url = '';
		}
		return url;
	}
	function sendEmail(approver,nextApprover,nextApproverText,documentNumber,recordId,status,suiteletUrl,mailPasscode,isEdited,rejComment,ApprData){
		var emailSent = false;
		try{
			var redirectUrl = suiteletUrl+'&recId='+recordId+'&approver='+nextApprover;
			var html =  '<html>';
			if(ApprData != null && ApprData != '' && ApprData != undefined){	
				html += '<head><style>table {border-collapse: collapse;border: 1px solid black;} th, td {border: 1px solid black;padding: 8px;}</style></head>';	
			}	
			html += '<body>';
			if(status == 'Approved'){
				html += 'Hi '+nextApproverText+',<br/><br/>PO - '+documentNumber+' is Approved.'
			}else if(status == 'Rejected'){
				html += 'Hi '+nextApproverText+',<br/><br/>PO - '+documentNumber+' is Rejected.';
				if(rejComment != '' && rejComment != null && rejComment != undefined){
					html += '<br/><br/>Comments : '+rejComment+'.';
				}
			}else if(status == 'Pending Approval'){
				html += 'Hi '+nextApproverText+',<br/><br/>PO - '+documentNumber+' is Pending Approval.<br/><br/>';
				if( isEdited == true){
					html += 'Purchase Order is changed. Please review and Approve it again.<br/>';
				}
				html += '<b>Use the Passcode: </b>'+mailPasscode+'<br/>';
				html += 'Please Click <a href= "'+redirectUrl+'"> here</a> to Approve/Reject the PO.<br/><br/>';
				html += '<b>Note: </b> Passcode should be entered before you Submit(Approve/Reject) the form and it can be used only once.';
			}
			if(ApprData != null && ApprData != '' && ApprData != undefined){	
				html += '<br/><br/>';	
				html += ApprData;	
			}
			html += '<br/><br/>Thanks.</body></html>';
			var poFile = render.transaction({
				entityId : Number(recordId),
				printMode : render.PrintMode.HTML
			});
			if( poFile  != null && poFile != '' && poFile != undefined){
				email.send({
					author      : approver,
					recipients  : nextApprover,
					subject     : 'PO - '+documentNumber+' is '+status+'.',
					body        : html,
					attachments : [poFile]
				});
				emailSent = true
			}
		}catch(ERR){
			log.error('Error occured in sendEmail function',ERR);
			emailSent = false;
		}
		return emailSent;
	}
	
	function approversDataInEmail(recId,editedNum,currentForm,ccenter,firstAppr,secondAppr,thirdAppr,fourthAppr/*,fifthAppr*/,itemLnes,expenseLnes){	
		try{	
			var userNoteAuthor  = new Array();	
			var userNoteComment = new Array();	
			var tableData       = '<table><thead><tr><td>Cost Center</td><td>Approver Name</td>';	
			var userNotesSearch = search.create({	
				type: search.Type.NOTE,	
				columns: [{name:'author'},{name:'title'},{name:'note'},{name:'internalid'},{name:'custrecord_crw_po_edited'}],	
				filters: [{name:'internalid',join:'transaction',operator:'anyof',values:recId},	
					{name:'mainline',join:'transaction',operator:'is',values:["T"]},	
					{name:'custrecord_crw_po_edited',operator:'greaterthanorequalto',values:editedNum}]	
			});	
			var Results = userNotesSearch.run().getRange({start:0,end:1000});	
			if(Results != null & Results != '' && Results != undefined){	
				if(Results.length>0){	
					tableData += '<td>Comments</td></tr></thead><tbody>';	
					for(var k=0;k<Results.length;k++){	
						userNoteAuthor.push(Results[k].getText({name:'author'}));	
						userNoteComment.push(Results[k].getValue({name:'note'}));	
					}	
				}	
			}else{	
				tableData += '</tr></thead><tbody>';	
			}	
				
			if(currentForm == expenseCustomForm){	
				var filter        = new Array();	
				filter.push(search.createFilter({name:'internalid',operator:'is',values:recId}));	
				filter.push(search.createFilter({name:'mainline',operator:'is',values:["F"]}));
				if(itemLnes>0){	
					filter.push(search.createFilter({name:'internalid',join:'item',operator:'noneof',values:["@NONE@"]}));	
				}else if(expenseLnes>0){	
					filter.push(search.createFilter({name:'internalid',join:'item',operator:'anyof',values:["@NONE@"]}));	
				}	
				var approverSearch = search.create({	
					type: search.Type.PURCHASE_ORDER,	
					filters: filter,	
					columns: [{name:'custcol_crw_approver',summary:'GROUP'},{name:'department',summary:'GROUP'}],	
				});	
				var apprSearchResults = approverSearch.run().getRange({start:0,end:1000});	
				if( apprSearchResults.length>0){	
					for(var z=0;z<apprSearchResults.length;z++){	
						tableData += '<tr><td>'+apprSearchResults[z].getText({name:'department',summary:'GROUP'})+'</td><td>'+apprSearchResults[z].getText({name:'custcol_crw_approver',summary:'GROUP'})+'</td>';	
						var returnData = commentsData(userNoteAuthor,apprSearchResults[z].getText({name:'custcol_crw_approver',summary:'GROUP'}),userNoteComment);	
						tableData += returnData;	
					}	
				}	
			}else{	
				tableData += '<tr><td>'+ccenter+'</td><td>'+firstAppr+'</td>';	
				var returnData = commentsData(userNoteAuthor,firstAppr,userNoteComment);	
				tableData += returnData;	
			}	
				
			//Add all other approvers and cost centers	
			if(secondAppr != null && secondAppr != '' && secondAppr != undefined){	
				tableData += '<tr><td>2nd Approver</td><td>'+secondAppr+'</td>';	
				var returnData = commentsData(userNoteAuthor,secondAppr,userNoteComment);	
				tableData += returnData;	
			}	
			if(thirdAppr != null && thirdAppr != '' && thirdAppr != undefined){	
				tableData += '<tr><td>3rd Approver</td><td>'+thirdAppr+'</td>';	
				var returnData = commentsData(userNoteAuthor,thirdAppr,userNoteComment);	
				tableData += returnData;	
			}	
			if(fourthAppr != null && fourthAppr != '' && fourthAppr != undefined){	
				tableData += '<tr><td>4th Approver</td><td>'+fourthAppr+'</td>';	
				var returnData = commentsData(userNoteAuthor,fourthAppr,userNoteComment);	
				tableData += returnData;	
			}	
			/*if(fifthAppr != null && fifthAppr != '' && fifthAppr != undefined){	
				tableData += '<tr><td>5th Approver</td><td>'+fifthAppr+'</td>';	
				var returnData = commentsData(userNoteAuthor,fifthAppr,userNoteComment);	
				tableData += returnData;	
			}	*/
			tableData += '</tbody></table>';	
		}catch(e){	
			log.error('Error Occured in ApproversDataInEmail Function',e);	
			tableData = '';	
		}	
		return tableData;	
	}	
		
	function commentsData(Author,Approver,Note){	
		try{	
			var Data = ''	
			if(Author.length>0){	
				var index = Author.indexOf(Approver);	
				if( index != -1){	
					Data = '<td>'+Note[index]+'</td></tr>';	
				}else{	
					Data = '<td></td></tr>';	
				} 	
			}else{	
				Data = '</tr>';	
			}	
		}catch(e){	
			log.error("Error during commentsData", e);	
			Data = '';	
		}	
		return Data;	
	}
	return {
		onRequest: onRequest
	};

});