var Collections = {}

//////////////////////////////////
// PHOTOS
Photos = Collections.Photos = new Meteor.Collection("photos");
Photos.allow({
  insert: function() {
    return false;
  },
  update: function() {
    return false;
  },
  remove: function() {
    return false;
  }
})

//////////////////////////////////
// USERS
Meteor.users.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove:function() {
    return true;
  }
})
Meteor.methods({
  addUser: function(elements) {
    elements = elements || {};

    Accounts.createUser({ email: elements.email, password: elements.password, profile: {firstname: elements.firstname, lastname: elements.lastname}})
  },
  updateUserDetails: function(user) {
    return Meteor.users.update(user._id, {
      $set: {
        'emails.0.address': user.email,
        'profile.firstname': user.firstname,
        'profile.lastname': user.lastname
      }
    });
  },
  removeUser: function(userid) {
    Meteor.users.remove(userid);
  }
});
