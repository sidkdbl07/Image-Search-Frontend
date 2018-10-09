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
});
Meteor.startup(() => {
  if(Meteor.isServer) {
    console.log("Re-creating indices...");
    Photos.rawCollection().createIndex({black: -1});
    Photos.rawCollection().createIndex({blue: -1});
    Photos.rawCollection().createIndex({brown: -1});
    Photos.rawCollection().createIndex({cyan: -1});
    Photos.rawCollection().createIndex({green: -1});
    Photos.rawCollection().createIndex({grey: -1});
    Photos.rawCollection().createIndex({orange: -1});
    Photos.rawCollection().createIndex({pink: -1});
    Photos.rawCollection().createIndex({purple: -1});
    Photos.rawCollection().createIndex({red: -1});
    Photos.rawCollection().createIndex({white: -1});
    Photos.rawCollection().createIndex({yellow: -1});
    Photos.rawCollection().createIndex({datetaken: -1});
    console.log("Complete")
  }
});

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
