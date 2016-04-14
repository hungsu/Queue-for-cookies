// Enable pusher logging - don't include this in production
Pusher.log = function(message) {
  if (window.console && window.console.log) {
    window.console.log(message);
  }
};

// formAuthenticityToken is a global set in application.html.erb
var pusher = new Pusher('16875e25b84dc444396e', {
  authEndpoint: '/pusher/auth',
  auth: {
    headers: {
      'X-CSRF-Token': formAuthenticityToken
    }
  }
});


/*
Arrive on page
join queue (channel)
If position in queue is less than quota
  "have a cookie"
else
  wait for even "member removed"
  check again
*/
var channel = pusher.subscribe('presence-biscuits');

// TODO Quota should not be in clientside code. Find another way to determine if person is eligible for cookie or not
var quota = 1;
var peopleAheadOfMe = [];

channel.bind('pusher:subscription_succeeded', function(members) {

  // if members count at time of subscription is less than QUOTA, give a cookie
  console.log(members.count,quota);
  if (members.count <= quota) {
    giveCookie();
  } else {
    // add each member in members to people ahead of me, excluding myself
    members.each(function(member) {
      if (member.id != members.myID) {
        peopleAheadOfMe.push(member.id);
      }
    });
  }
  console.log('People ahead of me:', peopleAheadOfMe);
});

channel.bind('pusher:member_removed', function(member) {
  // if member removed was a person ahead of me in line, update my position in line
  var index = peopleAheadOfMe.indexOf(member.id);
  if (index >= 0) {
    peopleAheadOfMe.splice(index,1);
  }
  console.log('People ahead of me:', peopleAheadOfMe);

  // If I am now in position for a cookie, give me a cookie
  if (peopleAheadOfMe.length < quota) {
    giveCookie();
  }
});

function giveCookie() {
  alert('Have a cookie ' + channel.members.me.info.name + '!');
  // Unsubscribe from events - e.g. don't give me a cookie again if another member joins and leaves
  channel.unbind('pusher:member_removed');
}
