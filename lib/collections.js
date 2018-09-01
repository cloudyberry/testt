import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Slots = new Mongo.Collection('slots');
export const Friends = new Mongo.Collection('friends');

export const ProfileImages = new FS.Collection("ProfileImages", {
	stores: [new FS.Store.GridFS("ProfileImages")]
});

ProfileImages.allow({
	insert: function(userId, doc){
		return true;
	},
	update: function(userId, doc, fields, modifier){
		return true;
	}
});

export const UserImages = new Mongo.Collection("UserImages");
UserImages.allow({
	insert: function(){
		return true;
	},
	update: function(userId, doc, fields, modifier){
		return true;
	}
});

Meteor.methods({
	'slots.insert'(getEventName, getEventType, getDuration, getStartTime, getDate){

		Slots.insert({
			eventName: getEventName,
			eventType: getEventType,
			duration: getDuration,
			startTime: getStartTime,
			date: getDate,
			owner: Meteor.userId(),
		});

	},

	'slots.build'(date, userID){
		var finalResult = "";
		switch (date.getMonth()) {
			case 0: noDays = 31; break;

			case 1:
			if (x.getFullYear() % 4 ==0) {
				noDays = 29;
			} else {
				noDays = 28;
			}
			break;

			case 2:noDays = 31;; break;
			case 3: noDays = 30; break;
			case 4: noDays = 31; break;
			case 5: noDays = 30; break;
			case 6: noDays = 31; break;
			case 7: noDays = 31; break;
			case 8: noDays = 30; break;
			case 9: noDays = 31; break;
			case 10: noDays = 30; break;
			case 11: noDays = 31; break;
		}

		var currentMonth = date.getMonth();
	var currentYear = date.getFullYear(); //crossover year
	var currentStartDate = date.getDate();

	var finalDate = "";
	finalDate += currentYear + "-";

	for (var i = 0; i <= 6; i++) {
		var sentDate = finalDate;
		if (currentStartDate + i > noDays) {
			currentStartDate = (-1*i) + 1;
			currentMonth += 1;
	//alert(date.getDate() + 1);                                                                                 ;
}
if (currentMonth < 10) {
	sentDate += "0" + (currentMonth + 1) + "-";
} else {
	sentDate += (currentMonth + 1) + "-";
}



if (currentStartDate + i  > 10) {
	sentDate +=  (currentStartDate + i);
} else {
	sentDate +=  "0" + (currentStartDate + i);
}

for (var j = 7; j < 24; j++) {
	if (j < 10) {
		var time = "0" + j + ":00";
	} else {
		var time = j + ":00";
	}
//	console.log("Slots.findOne({date: " + sentDate + ", startTime: " + time + "})");
	var x = Slots.findOne({date: sentDate, startTime: time, owner: userID});

	if (typeof x != 'undefined') {
//	console.log(x);

var name = x['eventName'];
var eventID = x['_id'];


finalResult +="<div class=\"scheduleSlots  &nbsp;" + name;
finalResult += "\" &nbsp; style=\"height:65px;width:";

var width = (parseInt(x['duration'])/60)*5.89;
finalResult += (width + "%;");


var topMargin = i*64.3;
finalResult += ("margin-top:" + topMargin + "px;");

var leftMargin = (j-7)*68.1;
finalResult += ("margin-left:" + leftMargin + "px;");

var type = x['eventType'];
//console.log(type);
var boxColor;

if (type == "Work") {
	boxColor = "#ffaa80";
} else if (type == "Personal") {
	boxColor = "#ff9999";
} else if (type == "School") {
	boxColor = "#ffff80";
} else if (type == "Sports") {
	boxColor = "#bfff80";
} else if (type == "Rehearsal") {
	boxColor = "#ff99ff";
}

finalResult += ("background-color:" + boxColor + ";");


var name = x['eventName'];

finalResult += ("\"><p class=\"eventName \">" + name + "</p><br><p class=\"eventType\">" + type);
	finalResult += ("<a href=\"#\" &nbsp; class=\"delete-slot x-content\"><i id=\"" + eventID + "\" &nbsp; class=\"material-icons cancelButton \">clear</i></div></a>");
//console.log(finalResult);
}


//mytable += x.eventName;
}

}
//console.log(finalResult);
return finalResult;



//console.log( "Slots.find({date: " + finalDate.toString() + ", startTime: " + time.toString() + "}).fetch()");
// Slots.find({date: finalDate.toString(), startTime: time.toString() }).fetch();

},

'slots.remove'(eventID){


//console.log(slot);

Slots.remove(eventID);

},

updateProfile: function(firstName, lastname,email, birthday, gender){
	if(!Meteor.userId()) {
				throw new Meteor.Error('not authorized');
				this.stop();
				return false;
			}
			else {

					Meteor.users.update(
						{ "_id": Meteor.userId() },
            { $set: {
							"profile.firstName": firstName,
							"profile.lastName" : lastname,
							"emails.0.address" : email,
							"profile.birthday" : birthday,
							"profile.gender" : gender
							},
					  }
					);
			}
	}

})
