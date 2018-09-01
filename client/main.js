import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import { Slots } from '../lib/collections.js';
import { Friends } from '../lib/collections.js';
import { ProfileImages } from '../lib/collections.js';
import { UserImages } from '../lib/collections.js';
import { Router, RouteController } from 'meteor/iron:router';


//Accounts config
Accounts.ui.config({
	passwordSignupFields:'USERNAME_ONLY'
});

import './main.html';


Template.body.helpers({
	slots() {
		return Slots.find({});
	},
});

Router.route('/settings', function () {
  this.render('settings');
});

Router.route('/about', function () {
  this.render('about');
});

Router.route('/support', function () {
  this.render('support');
});

Router.route('/friends', function () {
  this.render('friends');
});
Router.route('/editprofile', function () {
  this.render('editprofile');
});
Router.route('/main', function () {
  this.render('mainPage');
});


Template.weeklyView.helpers({

	'getResult': function(){
		return Session.get('result');
	},

	'buildWeekTable': function() {
		var mytable = "<table cellpadding=\"0\" cellspacing=\"0\"><tbody>";
		for (var i = 0; i <= 6; i++) {
			mytable += "<tr>"
			for (var j = 7; j < 24; j++) {
				mytable += "<td>";
			}
		}
		mytable += "</table>";

		return mytable;
	},

	'buildSlots': function() {


		if (!localStorage.currentFullDate) {
			localStorage.currentFullDate = new Date();
		}

		if (!localStorage.displayWeek) {
			var date = localStorage.currentFullDate;

			var x = new Date(date);



			while (x.getDay() != 0) {

				if (x.getDate() == 1) {

					if (x.getMonth() == 0) {
						x.setFullYear(x.getFullYear() - 1)
						x.setMonth(11);
						x.setDate(31);
					} else {
						x.setMonth(x.getMonth() -1);

						switch (x.getMonth()) {
							case 0: x.setDate(31); break;

							case 1:
							if (x.getFullYear() % 4 ==0) {
								x.setDate(29);
							} else {
								x.setDate(28);
							}
							break;

							case 2: x.setDate(31); break;
							case 3: x.setDate(30); break;
							case 4: x.setDate(31); break;
							case 5: x.setDate(30); break;
							case 6: x.setDate(31); break;
							case 7: x.setDate(31); break;
							case 8: x.setDate(30); break;
							case 9: x.setDate(31); break;
							case 10: x.setDate(30); break;
							case 11: x.setDate(31); break;
						}


					}
				} else {
					x.setDate(x.getDate() -1);
				}

			}
			localStorage.displayWeek = x;
		}



		var x = localStorage.displayWeek;
		var date = new Date(x);
		/*if (date.getMonth() < 10 ) {

			var sentDate = date.getFullYear() + "-0" + (date.getMonth()+1) ;

		} else {

			var sentDate = date.getFullYear() + "-" + (date.getMonth()+1) ;
			//what if crossover to other month
		}



for (var i = 0; i <= 6; i++) {

	finalDate = sentDate + "-" + (date.getDate() + i)
	for (var j = 7; j < 24; j++) {


if (j < 10) {
var sentTime = "0" + j + ":00";
}  else {
	var sentTime = j + ":00";
}
*/

var userID = Meteor.userId();

Meteor.call('slots.build', date, userID, function(error, result) {

	if (error) {
		return;
	}


 	//console.log(result);
 	document.getElementById("mySlots").innerHTML = result;

 //	console.log(result);
});

//const result = Meteor.call('slots.find', finalDate, sentTime);
//console.log(result);

//	} //end of inner loop
// } //end of outer loop


},



'buildWeekTime': function() {

	var myTime = "<table cellpadding=\"0\" cellspacing=\"0\"><tbody><tr>";
	for (var j = 7; j < 10; j++) {
		myTime += "<td>0"  + j + "00</td>";
	}
	for (var j = 10; j < 25; j++) {
		myTime += "<td>" + j + "00</td>";
	}
	myTime += "</tr></tbody></table>";
	return myTime;
},

'buildWeekDays': function() {
	var y = localStorage.displayWeek;
	var x = new Date(y);
	var date = x.getDate();
	var month = x.getMonth();

	var noDays;

	switch (month) {
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

	var days = new Array();
	days[0] = "Sun";
	days[1] = "Mon";
	days[2] = "Tues";
	days[3] = "Wed";
	days[4] = "Thurs";
	days[5] = "Fri";
	days[6] = "Sat";


	var dayOfWeek = 0;
	var mytable = "<table style=\"width:100%\">";

	while (date + dayOfWeek <= noDays && dayOfWeek < 7) {
		mytable += ("<tr><td>" + days[dayOfWeek] +"<br><p>" + (date + dayOfWeek) + "/" + (month + 1) + "</p>");
		dayOfWeek += 1;
	}
	if (date + 6 > noDays) {
		var p = 0;
		while (dayOfWeek < 7) {
			mytable += ("<tr><td>" + days[dayOfWeek] +"<br><p>" + (1 + p) + "/" + (month + 2) + "</p>");
			p += 1;
			dayOfWeek += 1;
		}
	}



	mytable += "</table>";
	//console.log(mytable);
	return mytable;
},





'updateDate': function() {
	if (!localStorage.currentYear) {
		var x = new Date();
		localStorage.currentYear = x.getFullYear();
	}

	if (!localStorage.currentMonth) {
		var x = new Date();
		localStorage.currentMonth = x.getMonth();
	}

	if (!localStorage.currentDate) {
		var x = new Date();
		localStorage.currentDate = x.getDate();
	}

	if (!localStorage.currentDay) {
		var x = new Date();
		localStorage.currentDate = x.getDay();
	}
},

'getCurrentYear': function() {

	return localStorage.currentYear;
},




'getWeek': function() {
	var week = new Array();
  week[0] = 1 //current week
  week[1] = 4 //number of weeks
  return week[x];
},



});

Template.monthlyView.helpers({

	'displayMonth': function() {
		var month = new Array();
		month[0] = "January";
		month[1] = "February";
		month[2] = "March";
		month[3] = "April";
		month[4] = "May";
		month[5] = "June";
		month[6] = "July";
		month[7] = "August";
		month[8] = "September";
		month[9] = "October";
		month[10] = "November";
		month[11] = "December";


		if (localStorage.currentMonth) {
			return month[Number(localStorage.currentMonth)];
		} else {
			var x = new Date();
			localStorage.currentMonth = x.getMonth()
			return month[Number(localStorage.currentMonth)];
		}
	},

	'buildMonthTable': function() {

		var mytable = "<table cellpadding=\"0\" cellspacing=\"0\"><tbody>";

		for (var i = 0; i <= 5; i++) {
			mytable += "<tr>"
			for (var j = 0; j < 7; j++) {
				mytable += "<td></td>";
			}
			mytable += "</tr>";
		}


		mytable += "</tbody></table>";

		return mytable;
	},

});

Template.viewMode.helpers({
	weeklyViewMode: {
		active: !(Number(localStorage.currentView))

	},

	monthlyViewMode: {
		active: Number(localStorage.currentView)

	}
});

/*Template.viewMode.events({
'click .changeWeekly': function() {

weeklyViewMode.active = true;
monthlyViewMode.active = false;
location.reload();

}


});

Template.animals.events({
  'click #add': function(e) {
    e.preventDefault();

    $('#animalsModal').modal('show');
  }
});*/

Template.weeklyView.events({
'click .delete-slot': function(event) {
   var removeID = event.target.id;


Meteor.call('slots.remove',removeID);
return false;
}


});

Template.addEvent.events({


	'submit form': function(event) {
		event.preventDefault();
		var getEventName = event.target.eventName.value;
		var getEventType = event.target.eventType.value;
		var getDuration = event.target.duration.value;
		var getStartTime = event.target.startTime.value;
		var getDate = event.target.eventDate.value;

		Meteor.call('slots.insert', getEventName, getEventType, getDuration, getStartTime, getDate);


		event.target.eventName.value = "";
		event.target.eventType.value = "";
		event.target.duration.value = "";
		event.target.startTime.value = "";
		event.target.eventDate.value = "";
		$('#addEvent').modal('toggle');

		return false;
	}

});

if( Meteor.isClient) {
	Template.register.events({
		'submit form': function(event) {
			event.preventDefault();
			var getUserName = event.target.username.value;
			var getFirstName = event.target.firstName.value;
	  	var getLastName = event.target.lastName.value;
			var getEmail = event.target.email.value;
			var getPassword = event.target.password.value;
			var getGender = event.target.gender.value;
			var getBirthday = event.target.bday.value;

			Accounts.createUser({
        username: getUserName,
				email: getEmail,
				password: getPassword,
				profile:{
					firstName: getFirstName,
			    lastName: getLastName,
					gender: getGender,
					birthday: getBirthday,
				}
			})
		}
	});
	Template.login.events({
    'submit form': function(event) {
      event.preventDefault();
        var getUserName = event.target.name.value;
        var getPassword = event.target.password.value;

				Meteor.loginWithPassword(getUserName, getPassword, function(err) {
						if(err) {
							alert("Oops! Wrong username or password");
						} else {
							Router.go("/main");
						}
					});
				}

	});
}

Template.editprofile.helpers({
	username: function() {
		return Meteor.user().username;
	},
	firstname: function() {
		return Meteor.user().profile.firstName;
	},
	lastname: function() {
		return Meteor.user().profile.lastName;
	},
	email: function() {
		return Meteor.user().emails[0].address;
	},
	date: function() {
		return Meteor.user().profile.birthday;
	},
	female: function() {
		var gender = Meteor.user().profile.gender;
		if( gender === "female") {
			return true;
		}
		return false;
	},
	male: function() {
		var gender= Meteor.user().profile.gender;
		if( gender === "male"){
			return true;
		}
		return false;
	},

	UserImages: function() {
  var username = Meteor.user().username;
	var userId = Meteor.userId();
	var URL = UserImages.findOne({username: username},{userId: userId});
	return URL;
  },



});

Template.editprofile.events({
	'submit .profilepic': function(event) {
		var file = $('#profileImage').get(0).files[0];

		if (file) {

			fsFile = new FS.File(file);

			ProfileImages.insert(fsFile, function(err, result){
				if (err) {
					throw new Meteor.Error(err);
				} else {

					var imageLoc = '/cfs/files/ProfileImages/'+result._id;

					UserImages.insert({
						userId: Meteor.userId(),
						username: Meteor.user().username,
						image: imageLoc,
					});

					alert("Profile Update Successful!");
				}
			});

		}

		return false; // prevent submit
	},
	'submit .updatepic': function(event){
		// i am trying to allow the user to change the profile picture
		// upn submitting the form
		var file = $('#profileImages').get(0).files[0];
		ProfileImages.remove(file,function(err,file) {
			if(err) {
				alert("wrong");
			}
		});
	},


	"submit form": function(event){

		var firstName = event.target.firstName.value;
		var lastName = event.target.lastName.value;
		var email = event.target.email.value;
	  var birthday = event.target.bday.value;
		var gender = event.target.gender.value;

		Meteor.call('updateProfile', firstName,lastName, email, birthday,gender);

	}


});
Template.main.events({
	"click #logout" : function(event) {
		event.preventDefault();
			Meteor.logout();
	}
});

Template.about.events({
	"click #logout" : function(event) {
		event.preventDefault();
		Meteor.logout();
		Router.go('/main');
	}
});
Template.settings.events({
	"click #logout" : function(event) {
		event.preventDefault();
		Meteor.logout();
		Router.go('/main');
	}
});
Template.support.events({
	"click #logout" : function(event) {
		event.preventDefault();
		Meteor.logout();
		Router.go('/main');
	}
});
Template.editprofile.events({
	"click #logout" : function(event) {
		event.preventDefault();
		Meteor.logout();
		Router.go('/main');
	}
});
