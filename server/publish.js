Meteor.publish('photos', function(limit) {
  return Photos.find({status: 'processed'}, {limit: limit});
})

Meteor.publish('singleuser', function(user_id) {
  return Meteor.users.find({_id: user_id}, {fields: {_id:1,"emails.address":1,profile:1}});
});

Meteor.publish('users', function() {
  return Meteor.users.find();
});

ReactiveTable.publish('users-rt', function() {
  return Meteor.users;
});
