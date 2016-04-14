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

var quota = 1;
var peopleAheadOfMe = [];

channel.bind('pusher:subscription_succeeded', function(members) {
  // if members count at time of subscription is less than QUOTA, give a cookie
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
  peopleAheadOfMe = peopleAheadOfMe.filter(function(value){
    return value != member.id;
  });
  console.log('People ahead of me:', peopleAheadOfMe);

  // If I am now in position for a cookie, give me a cookie
  if (peopleAheadOfMe.length < quota) {
    giveCookie();
  }
});

function giveCookie() {
  alert('Have a cookie ' + channel.members.me.info.name + '!');
  // Unsubscribe from events - e.g. don't give me a cookie again if another member leaves
  channel.unbind('pusher:member_removed');
}
