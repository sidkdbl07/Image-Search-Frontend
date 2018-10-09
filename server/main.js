import { Meteor } from 'meteor/meteor';
import moment from 'moment';

Meteor.startup(() => {
  if(Meteor.users.find().count() == 0) {
    Accounts.createUser({ email: "sid@sidkwakkel.com", password: "1234", profile: {firstname: "Sidney", lastname: "Kwakkel"}});
    Accounts.createUser({ email: "zwarichj@ae.ca", password: "1234", profile: {firstname: "Jase", lastname: "Zwarich"}});
  }
  console.log(Photos.find().count()+" photos in the database");

});
