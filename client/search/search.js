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
  morePhotos: function() {
    return !(Photos.find().count() < Session.get('photosLimit'))
  },
  photos: function() {
    return Photos.find().fetch();
  },
  selectedPhoto: function() {
    return Photos.findOne({_id: Session.get('selectedPhoto')});
  }
});

Template.search.events({
  'click .close-side-view': function(e) {
    e.preventDefault();
    $("#side-view").removeClass("show");
  },
  'click .photo-container': function(e) {
    e.preventDefault();
    var target = $(e.target);
    if(!$(e.target).hasClass('photo-container')) {
      target = $(e.target).closest('div.photo-container');
    }
    photoid = target.attr('photo-id');
    Session.set('selectedPhoto', photoid);
    $("#side-view").addClass("show");
  },
  'scroll #photos-content': function(e) {
    e.preventDefault();
    showMoreVisible();
  },
  'mouseenter .photo-container': function(e) {
    e.preventDefault();
    $(e.target).find('.photo-tag').addClass('show');
  },
  'mouseleave .photo-container': function(e) {
    e.preventDefault();
    $('.photo-tag').removeClass('show');
  }
});
