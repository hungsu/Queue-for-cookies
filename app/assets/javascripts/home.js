// Enable pusher logging - don't include this in production
// Pusher.log = function(message) {
//   if (window.console && window.console.log) {
//     window.console.log(message);
//   }
// };

var channel = pusher.subscribe('presence-biscuits');
channel.bind('my_event', function(data) {
  alert(data.message);
});
