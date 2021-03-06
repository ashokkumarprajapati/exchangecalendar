/* ***** BEGIN LICENSE BLOCK *****
 * Version: GPL 3.0
 *
 * The contents of this file are subject to the General Public License
 * 3.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.gnu.org/licenses/gpl.html
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * Author: Michel Verbraak (info@1st-setup.nl)
 * Website: http://www.1st-setup.nl/
 *
 * This interface/service is used for loadBalancing Request to Exchange
 *
 * ***** BEGIN LICENSE BLOCK *****/

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;
var Cr = Components.results;
var components = Components;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

Cu.import("resource://exchangecalendar/ecExchangeRequest.js");

Cu.import("resource://calendar/modules/calProviderUtils.jsm");

Cu.import("resource://interfaces/exchangeBaseItem/mivExchangeBaseItem.js");

function mivExchangeTodo() {

	this.initialize();

	this.initExchangeBaseItem();

	this.miv = this.globalFunctions.getUUID();

	//this.logInfo("mivExchangeTodo: init");

}

var mivExchangeTodoGUID = "95dac4fd-58c7-44f9-80ad-1448558fc460";

mivExchangeTodo.prototype = {

	__proto__ : mivExchangeBaseItem.prototype,

	QueryInterface : XPCOMUtils.generateQI([Ci.mivExchangeTodo,
				Ci.mivExchangeBaseItem,
				Ci.calIInternalShallowCopy,
				Ci.calITodo,
				Ci.calIItemBase,
				Ci.nsIClassInfo,
				Ci.nsISupports]),

	_className : "mivExchangeTodo",
	_mainTag : "Task",

	classDescription : "Exchange calendar todo/task.",

	classID : components.ID("{"+mivExchangeTodoGUID+"}"),
	contractID : "@1st-setup.nl/exchange/calendartodo;1",
	flags : Ci.nsIClassInfo.THREADSAFE,
	implementationLanguage : Ci.nsIProgrammingLanguage.JAVASCRIPT,

	getInterfaces : function _getInterfaces(count) 
	{
		var ifaces = [Ci.mivExchangeTodo,
				Ci.mivExchangeBaseItem,
				Ci.calIInternalShallowCopy,
				Ci.calITodo,
				Ci.calIItemBase,
				Ci.nsIClassInfo,
				Ci.nsISupports];

		count.value = ifaces.length;
		return ifaces;
	},

	initialize : function _initialize()
	{
		this._calEvent = null;
		this._calEvent = Cc["@mozilla.org/calendar/todo;1"]
					.createInstance(Ci.calITodo);
	},

	get startDate()
	{
		return this.entryDate;
	},

	//attribute calIDateTime entryDate;
	get entryDate()
	{
		//this.logInfo("get entryDate 1: title:"+this.title);
		if (!this._entryDate) {
			this._entryDate = this.tryToSetDateValue(this.getTagValue("t:StartDate", null), this._calEvent.entryDate);
			if (this._entryDate) {
				if (this.isAllDayEvent) this._entryDate.isDate = true;

				var timezone = this.timeZones.getCalTimeZoneByExchangeTimeZone(this.getTag("t:StartTimeZone"), "", this._entryDate);
				if (timezone) {
					this._entryDate = this._entryDate.getInTimezone(timezone);
				}
				this._calEvent.entryDate = this._entryDate.clone();
			}
		}
		this.logInfo("get entryDate 2: title:"+this.title+", startdate=="+this._calEvent.entryDate);
		return this._calEvent.entryDate;
	},

	set entryDate(aValue)
	{
		//this.logInfo("set entryDate: title:"+this.title+", aValue:"+aValue);
		if (aValue) {
			if ((!this._newEntryDate) || (aValue.compare(this._newEntryDate) != 0)) {
				this._newEntryDate = aValue;
				this._calEvent.entryDate = aValue;
			}
		}
		else {
			if (this.entryDate !== null) {
				this._newEntryDate = aValue;
				this._calEvent.entryDate = aValue;
			}
		}
	},

	get endDate()
	{
		return this.dueDate;
	},

	//attribute calIDateTime dueDate;
	get dueDate()
	{
		//this.logInfo("get dueDate 1: title:"+this.title);
		if (!this._dueDate) {
			this._dueDate = this.tryToSetDateValue(this.getTagValue("t:DueDate", null), this._calEvent.dueDate);
			if (this._dueDate) {
				if (this.isAllDayEvent) this._dueDate.isDate = true;

				var timezone = this.timeZones.getCalTimeZoneByExchangeTimeZone(this.getTag("t:StartTimeZone"), "", this._dueDate);
				if (timezone) {
					this._dueDate = this._dueDate.getInTimezone(timezone);
				}
				this._calEvent.dueDate = this._dueDate.clone();
			}
		}
		this.logInfo("get dueDate 2: title:"+this.title+", startdate=="+this._calEvent.dueDate);
		return this._calEvent.dueDate;
	},

	set dueDate(aValue)
	{
		this.logInfo("set dueDate: title:"+this.title+", aValue:"+aValue);
		if (aValue) {
			if ((!this._newDueDate) || (aValue.compare(this._newDueDate) != 0)) {
				this._newDueDate = aValue;
				this._calEvent.dueDate = aValue;
			}
		}
		else {
			if (this.dueDate !== null) {
				this._newDueDate = aValue;
				this._calEvent.dueDate = aValue;
			}
		}
	},

	//attribute calIDateTime completedDate;
	get completedDate()
	{
		//this.logInfo("get completedDate 1: title:"+this.title);
		if (!this._completedDate) {
			this._completedDate = this.tryToSetDateValue(this.getTagValue("t:CompleteDate", null), this._calEvent.completedDate);
			if (this._completedDate) {
				if (this.isAllDayEvent) this._completedDate.isDate = true;

				var timezone = this.timeZones.getCalTimeZoneByExchangeTimeZone(this.getTag("t:StartTimeZone"), "", this._completedDate);
				if (timezone) {
					this._completedDate = this._completedDate.getInTimezone(timezone);
				}
				this._calEvent.completedDate = this._completedDate.clone();
			}
		}
		//this.logInfo("get completedDate 2: title:"+this.title+", startdate=="+this._calEvent.completedDate);
		return this._calEvent.dueDate;
	},

	set completedDate(aValue)
	{
		this.logInfo("set completedDate: title:"+this.title+", aValue:"+aValue);
		if (aValue) {
			if ((!this._newCompletedDate) || (aValue.compare(this._newCompletedDate) != 0)) {
				this._newCompletedDate = aValue;
				this._calEvent.completedDate = aValue;
			}
		}
		else {
			if (this.completedDate !== null) {
				this._newCompletedDate = aValue;
				this._calEvent.completedDate = aValue;
			}
		}
	},

	//attribute short percentComplete;
	get percentComplete()
	{
		//this.logInfo("get percentComplete 1: title:"+this.title);
		if (!this._percentComplete) {
			this._percentComplete = this.getTagValue("t:PercentComplete", 0);
			if (this._percentComplete) {
				this._calEvent.percentComplete = this._percentComplete;
			}
		}
		return this._calEvent.percentComplete;
	},

	set percentComplete(aValue)
	{
		//this.logInfo("set percentComplete: title:"+this.title+", aValue:"+aValue);
		if (aValue != this.percentComplete) {
			this._newPercentComplete = aValue;
			this._calEvent.percentComplete = aValue;
		}
	},

	get isCompleted()
	{
		if (!this._isCompleted) {
			this._isCompleted = (this.status == "COMPLETED");
			this._calEvent.isCompleted = this._isCompleted;
		}

		return this._calEvent.isCompleted;
	},

	set isCompleted(aValue)
	{
		if (aValue != this.isCompleted) {
			this._newIsCompleted = aValue;
		}


		this._calEvent.isCompleted = aValue;
	},

	//attribute long totalWork;
	get totalWork()
	{
		//this.logInfo("get totalWork 1: title:"+this.title);
		if (!this._totalWork) {
			this._totalWork = this.getTagValue("t:TotalWork", 0);
		}
		return this._totalWork;
	},

	set totalWork(aValue)
	{
		//this.logInfo("set totalWork: title:"+this.title+", aValue:"+aValue);
		if (aValue != this.totalWork) {
			this._newTotalWork = aValue;
			this._totalWork = aValue;
		}
	},

	//attribute long totalWork;
	get actualWork()
	{
		//this.logInfo("get actualWork 1: title:"+this.title);
		if (!this._actualWork) {
			this._actualWork = this.getTagValue("t:ActualWork", 0);
		}
		return this._actualWork;
	},

	set actualWork(aValue)
	{
		//this.logInfo("set actualWork: title:"+this.title+", aValue:"+aValue);
		if (aValue != this.actualWork) {
			this._newActualWork = aValue;
			this._actualWork = aValue;
		}
	},

	//attribute AUTF8String mileage;
	get mileage()
	{
		//this.logInfo("get mileage 1: title:"+this.title);
		if (!this._mileage) {
			this._mileage = this.getTagValue("t:Mileage", "");
		}
		return this._mileage;
	},

	set mileage(aValue)
	{
		//this.logInfo("set mileage: title:"+this.title+", aValue:"+aValue);
		if (aValue != this.mileage) {
			this._newMileage = aValue;
			this._mileage = aValue;
		}
	},

	//attribute AUTF8String billingInformation;
	get billingInformation()
	{
		//this.logInfo("get billingInformation 1: title:"+this.title);
		if (!this._billingInformation) {
			this._billingInformation = this.getTagValue("t:BillingInformation", "");
		}
		return this._billingInformation;
	},

	set billingInformation(aValue)
	{
		//this.logInfo("set billingInformation: title:"+this.title+", aValue:"+aValue);
		if (aValue != this.billingInformation) {
			this._newBillingInformation = aValue;
			this._billingInformation = aValue;
		}
	},

	//void getCompanies(out PRUint32 count, [array, size_is(count), retval] out AUTF8String aCompanies);
	get companies()
	{
		var tmpCompanies = this.getCompanies({});
		result = "";
		for (var index in tmpCompanies) {
			if (result != "") {
				result += ", ";
			}
			result += tmpCompanies[index];
		}

		return result;
	},

	set companies(aValue)
	{
		// Replace ", " (comma + space) by only comma.
		var tmpStr = aValue;

		while (tmpStr.indexOf(", ") >= 0) {
			tmpStr = tmpStr.replace(/, /g, ",");
		}
		
		var newArray = tmpStr.split(",");
		newResult = "";
		for (var index in newArray) {
			if (newResult != "") {
				newResult += ", ";
			}
			newResult += newArray[index];
		}

		if (this.companies != newResult) {
			this.clearCompanies();
			for (var index in newArray) {
				this.addCompany(newArray[index]);
			}
		}
		
	},

	getCompanies: function _getCompanies(aCount)
	{
		if (!this._companies) {
			this._companies = new Array();
			if (this._exchangeData) {
				var tmpStr = this._exchangeData.XPath("/t:Companies/t:String");
				for each(var string in tmpStr) {
					this._companies.push(string.value);
				}
			}
		}

		if (this._newCompanies) {
			aCount.value = this._newCompanies.length;
			return this._newCompanies;
		}
		
		aCount.value = this._companies.length;
		return this._companies;
	},

	//void addCompany(in AUTF8String aCompany);
	addCompany: function _addCompany(aCompany)
	{
		if (!this._newCompanies) {
			this._newCompanies = new Array();
		}

		this._newCompanies.push(aCompany);
	},

	//void clearCompanies();
	clearCompanies: function _clearCompanies()
	{
		this._newCompanies = new Array();
	},

	get duration()
	{
		if ((!this._duration) && (!this._newEndDate) && (!this._newStartDate)) {
			this._duration = this.getTagValue("t:Duration", null);
			if (this._duration) {
				//this.logInfo("get duration: title:"+this.title+", value:"+cal.createDuration(this._duration));
				return cal.createDuration(this._duration);
			}
		}
		//this.logInfo("get duration: title:"+this.title+", value:"+this._calEvent.duration);
		return this._calEvent.duration;
	},

	set duration(aValue)
	{
		if (aValue.toString() != this.duration.toString()) {
			this._newDuration = aValue;
			this._calEvent.duration = aValue;
		}
	},

	// status of the event
	//attribute AUTF8String status;
	get status()
	{
		if (!this._status) {
			this._status = this.getTagValue("t:Status", null);


			const statusMap = {
				"NotStarted"	: "NONE",
				"InProgress" : "IN-PROCESS",
				"Completed"	: "COMPLETED",
				"WaitingOnOthers"	: "NEEDS-ACTION",
				"Deferred"	: "CANCELLED",
				null: "NONE"
			};

			this._calEvent.status = statusMap[this._status];
		}
		//this.logInfo("get status: title:"+this.title+", value:"+this._calEvent.status+", this._status:"+this._status);
		return this._calEvent.status;
	},

	set status(aValue)
	{
		if (aValue != this.status) {

			const statuses = { "NONE": "NotStarted",
					"IN-PROCESS": "InProgress", 
					"COMPLETED" : "Completed",
					"NEEDS-ACTION" : "WaitingOnOthers",
					"CANCELLED" : "Deferred",
					null: "NotStarted" };

			this._newStatus = statuses[aValue];
			this._calEvent.status = aValue;
			this._calEvent.setProperty("STATUS", aValue);
		}
	},

	//readonly attribute AUTF8String owner;
	get owner()
	{
		if (!this._owner) {
			this._owner = this.getTagValue("t:Owner", "(unknown)");
		}

		return this._owner;
	},

	get updateXML()
	{
		this._nonPersonalDataChanged = false;

		var updates = this.globalFunctions.xmlToJxon('<t:Updates xmlns:m="'+nsMessagesStr+'" xmlns:t="'+nsTypesStr+'"/>');

		if (this._newTitle) {
			this._nonPersonalDataChanged = true;
			this.addSetItemField(updates, "Subject", this._newTitle);
		}
		if (this._newPrivacy) {
			this.addSetItemField(updates, "Sensitivity", this._newPrivacy);
		}
		if (this._newBody) {
			this._nonPersonalDataChanged = true;
			this.addSetItemField(updates, "Body", this._newBody, { BodyType: "Text" });
		}

		if (this._newPercentComplete) {
			this._nonPersonalDataChanged = true;
			this.addSetItemField(updates, "PercentComplete", this._newPercentComplete);
		}

		if (this._newStatus) {
			this._nonPersonalDataChanged = true;
			this.addSetItemField(updates, "Status", this._newStatus);
		}

		if (this._newTotalWork) {
			this._nonPersonalDataChanged = true;
			this.addSetItemField(updates, "TotalWork", this._newTotalWork);
		}

		if (this._newActualWork) {
			this._nonPersonalDataChanged = true;
			this.addSetItemField(updates, "ActualWork", this._newActualWork);
		}

		if (this._newMileage) {
			this._nonPersonalDataChanged = true;
			this.addSetItemField(updates, "Mileage", this._newMileage);
		}

		if (this._newBillingInformation) {
			this._nonPersonalDataChanged = true;
			this.addSetItemField(updates, "BillingInformation", this._newBillingInformation);
		}

		// Categories
		if (this._changesCategories) {
			var categoriesXML = Cc["@1st-setup.nl/conversion/xml2jxon;1"]
						.createInstance(Ci.mivIxml2jxon);
			var categories = this.getCategories({});
			var first = true;
			for each(var category in categories) {
				if (first) {
					first = false;
					categoriesXML.processXMLString("<t:String>"+category+"</t:String>", 0, null);
				}
				else {
					categoriesXML.addSibblingTag("String", "t", category);
				}
			}
			if (categories.length > 0) {
				this.addSetItemField(updates, "Categories", categoriesXML);
			}
			else {
				if (this._categories.length > 0) {
					this.addDeleteItemField(updates, "Categories");
				}
			}
		}

		// Companies
		if (this._newCompanies) {
			var companiesXML = Cc["@1st-setup.nl/conversion/xml2jxon;1"]
						.createInstance(Ci.mivIxml2jxon);
			var companies = this.getCompanies({});
			//var companies = this.companies;
			var first = true;
			for each(var company in companies) {
				if (first) {
					first = false;
					companiesXML.processXMLString("<t:String>"+company+"</t:String>", 0, null);
				}
				else {
					companiesXML.addSibblingTag("String", "t", company);
				}
			}
			if (companies.length > 0) {
				this.addSetItemField(updates, "Companies", companiesXML);
			}
			else {
				if (this._companies.length > 0) {
					this.addDeleteItemField(updates, "Companies");
				}
			}
		}

		if (this._newPriority) {
			this.addSetItemField(updates, "Importance", this._newPriority);
		}


		this.entryDate;
		if (this._newEntryDate) {
			var tmpStart = this._newEntryDate.clone().getInTimezone(this.globalFunctions.ecUTC());
			if (this._newEntryDate.isDate) {
				tmpStart.isDate = false;
				var tmpDuration = cal.createDuration();
				tmpDuration.minutes = -60;
				tmpStart.addDuration(tmpDuration);

				// We make a non-UTC datetime value for this.globalFunctions.
				// EWS will use the MeetingTimeZone or StartTimeZone and EndTimeZone to convert.
				var exchStart = cal.toRFC3339(tmpStart).substr(0, 19)+"Z"; //cal.toRFC3339(tmpStart).length-6);
			}
			else {
				// We set in bias advanced to UCT datetime values for this.globalFunctions.
				var exchStart = cal.toRFC3339(tmpStart).substr(0, 19)+"Z";
			}
			this._nonPersonalDataChanged = true;
			this.addSetItemField(updates, "StartDate", exchStart);
		}
		else {
			if (((this._entryDate) && (this._newEntryDate === null)) || (this._entryDate === undefined)) {
				this._nonPersonalDataChanged = true;
				this.addDeleteItemField(updates, "StartDate");
			}
		}

		this.dueDate;
		if (this._newDueDate) {
			var tmpEnd = this._newDueDate.clone().getInTimezone(this.globalFunctions.ecUTC());

			if (this._newDueDate.isDate) {
				tmpEnd.isDate = false;
				var tmpDuration = cal.createDuration();
				tmpDuration.minutes = -61;
				tmpEnd.addDuration(tmpDuration);

				// We make a non-UTC datetime value for this.globalFunctions.
				// EWS will use the MeetingTimeZone or StartTimeZone and EndTimeZone to convert.
				var exchEnd = cal.toRFC3339(tmpEnd).substr(0, 19)+"Z"; //cal.toRFC3339(tmpEnd).length-6);
			}
			else {
				// We set in bias advanced to UCT datetime values for this.globalFunctions.
				var exchEnd = cal.toRFC3339(tmpEnd).substr(0, 19)+"Z";
			}
			this._nonPersonalDataChanged = true;
			this.addSetItemField(updates, "DueDate", exchEnd);
		}
		else {
			if (((this._dueDate) && (this._newDueDate === null)) || (this._dueDate === undefined)) {
				this._nonPersonalDataChanged = true;
				this.addDeleteItemField(updates, "DueDate");
			}
		}

		this.completionDate;
		if (this._newCompletedDate) {
			var tmpEnd = this._newCompletedDate.clone().getInTimezone(this.globalFunctions.ecUTC());

			if (this._newCompletedDate.isDate) {
				tmpEnd.isDate = false;
				var tmpDuration = cal.createDuration();
				tmpDuration.minutes = -61;
				tmpEnd.addDuration(tmpDuration);

				// We make a non-UTC datetime value for this.globalFunctions.
				// EWS will use the MeetingTimeZone or StartTimeZone and EndTimeZone to convert.
				var exchEnd = cal.toRFC3339(tmpEnd).substr(0, 19)+"Z"; //cal.toRFC3339(tmpEnd).length-6);
			}
			else {
				// We set in bias advanced to UCT datetime values for this.globalFunctions.
				var exchEnd = cal.toRFC3339(tmpEnd).substr(0, 19)+"Z";
			}
			this._nonPersonalDataChanged = true;
			this.addSetItemField(updates, "CompleteDate", exchEnd);
		}
		else {
			if (((this._completedDate) && (this._newCompletedDate === null)) || (this._completedDate === undefined)) {
				this._nonPersonalDataChanged = true;
				this.addDeleteItemField(updates, "CompleteDate");
			}
		}

		if (this._newLegacyFreeBusyStatus) {
			this.addSetItemField(updates, "LegacyFreeBusyStatus", this._newLegacyFreeBusyStatus);
		}

		if (this._newLocation) {
			this._nonPersonalDataChanged = true;
			this.addSetItemField(updates, "Location", this._newLocation);
		}

		// Recurrence rule. Michel
		var recurrenceInfoChanged;
		if (this._recurrenceInfo) {
			// We had recurrenceInfo. Lets see if it changed.
			this.logInfo("We had recurrenceInfo. Lets see if it changed.");
			if (this._newRecurrenceInfo !== undefined) {
				// It was changed or removed
				if (this._newRecurrenceInfo === null) {
					// It was removed
					this.logInfo("We had recurrenceInfo. And it is removed.");
					recurrenceInfoChanged = false;
					this._nonPersonalDataChanged = true;
					this.addDeleteItemField(updates, "Recurrence");
				}
				else {
					// See if something changed
					this.logInfo("We had recurrenceInfo. And it was changed.");
					recurrenceInfoChanged = true;
				}
			}
		}
		else {
			// We did not have recurrence info. Check if we have now
			this.logInfo("We did not have recurrenceInfo. See if it was added.");
			if (this._newRecurrenceInfo) {
				this.logInfo("We did not have recurrenceInfo. But we do have now.");
				recurrenceInfoChanged = true;
			}
		}
		if (recurrenceInfoChanged) {
			
			var recurrenceXML = this.makeRecurrenceRule();
			this._nonPersonalDataChanged = true;
			this.addSetItemField(updates, "Recurrence", recurrenceXML, null, true);
		}
		

		// Alarms and snoozes
		this.checkAlarmChange(updates);

		//dump("updates:"+updates.toString()+"\n");
		return updates;
	},

};

function NSGetFactory(cid) {

	try {
		if (!NSGetFactory.mivExchangeTodo) {
			// Load main script from lightning that we need.
			NSGetFactory.mivExchangeTodo = XPCOMUtils.generateNSGetFactory([mivExchangeTodo]);

	}

	} catch(e) {
		Components.utils.reportError(e);
		dump(e);
		throw e;
	}

	return NSGetFactory.mivExchangeTodo(cid);
} 

