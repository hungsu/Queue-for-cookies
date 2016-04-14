$(document).ready(function(){
	var $widget = $('.js-cookie-widget');

	// Only initialise widget if widget element is on page
	if ($widget.length > 0) {
		// formAuthenticityToken is a global set in application.html.erb
		var pusher = new Pusher('16875e25b84dc444396e', {
			authEndpoint: '/pusher/auth',
			auth: {
				headers: {
					'X-CSRF-Token': formAuthenticityToken
				}
			}
		});

		var channel = pusher.subscribe('presence-cookies');

		var quota = 1;
		var peopleAheadOfMe = [];

		/*
		When user logs into app
		If number of current users is less than the app's quota, give this user a cookie
		Otherwise:
		  build an array of users in line ahead of this user, (all current users except this user)
		  Let this user know they are in a queue.
		*/
		channel.bind('pusher:subscription_succeeded', function(members) {
			if (members.count <= quota) {
			  giveCookie();
			} else {
			  members.each(function(member) {
				if (member.id != members.myID) {
				  peopleAheadOfMe.push(member.id);
				}
			  });

			  $widget[0].textContent = positionInLine(peopleAheadOfMe.length - quota);
			}
		});

		channel.bind('pusher:member_removed', function(member) {
			// if member removed was a person ahead of me in line, update my position in line
			peopleAheadOfMe = peopleAheadOfMe.filter(function(value){
				return value != member.id;
			});

			// If I am now in position for a cookie, give me a cookie
			if (peopleAheadOfMe.length < quota) {
				giveCookie();
			} else {
				$widget[0].textContent = positionInLine(peopleAheadOfMe.length - quota);
			}
		});

		var giveCookie = function() {
			$widget[0].textContent = 'Have a cookie ' + channel.members.me.info.name + '!';
			// Unsubscribe from events - e.g. don't give me a cookie again if another member leaves
			channel.unbind('pusher:member_removed');
		};

		var positionInLine = function(position) {
			var suffixes = ['st','nd','rd','th','th','th','th','th','th','th'];
			var positionString = "";
			if (position === 0) {
			  positionString = "next";
			} else {
			  positionString = (position+1) + suffixes[position % 10];
			}
			return "You're " + positionString + " in line for a cookie.";
		};

		var debugMessages = pusher.subscribe("test_channel");
			debugMessages.bind('my_event', function(data) {
			console.log(data.message);
		});
	}
});
