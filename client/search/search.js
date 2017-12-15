import moment from 'moment';
import { toast } from '../snackbar.js';

if (Meteor.isClient) {
  var PHOTOS_INCREMENT = 64;

  //Template.search.photos = function() {
  //  return Photos.find();
  //}
  //Template.search.morePhotos = function() {
  //  return !(Photos.find().count() < Session.get('photosLimit'))
  //}


}

function showMoreVisible() {
  var threshold, target = $("#showMorePhotos");
  if(!target.length) return;

  threshold = $("#photos-content").scrollTop() + $("#photos-content").height() - target.height();

  //console.log("Target offset top: "+target.offset().top);
  //console.log("threshold: "+threshold);
  if(target.offset().top < threshold) {
    if(!target.data("visible")) {
      //console.log('ok');
      target.data("visible", true);
      Session.set('photosLimit', Session.get('photosLimit')+PHOTOS_INCREMENT);
    }
  } else {
    if(target.data("visible")) {
      //console.log("no");
      target.data("visible", false);
    }
  }
}

Template.search.onRendered(function() {
  //$("#inspection-date").datepicker();

  Session.setDefault('photosLimit', PHOTOS_INCREMENT);
  this.autorun(() => {
    //console.log(Session.get('photosLimit'));
    Meteor.subscribe('photos', Session.get('photosLimit'));
  });
});

Template.search.onCreated(function() {
  Session.set('photosLimit', PHOTOS_INCREMENT);
  $("#photos-content").scroll(function() {
    showMoreVisible()
  });
});

Template.search.helpers({
  formattedDate: function(date) {
    return moment(date).format('MMM D, YYYY');
  },
  photos: function() {
    return Photos.find().fetch();
  },
  morePhotos: function() {
    return !(Photos.find().count() < Session.get('photosLimit'))
  }
});

Template.search.events({
  'scroll #photos-content': function(e) {
    e.preventDefault();
    showMoreVisible();
  }
});
