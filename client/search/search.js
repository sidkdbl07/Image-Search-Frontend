import moment from 'moment';
import { toast } from '../snackbar.js';
import { Tracker } from 'meteor/tracker'

if (Meteor.isClient) {
  var PHOTOS_INCREMENT = 128;

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
      if(Session.get('photosLimit') < 2000) { // 2 thousand pics max
        Session.set('photosLimit', Session.get('photosLimit')+PHOTOS_INCREMENT);
      }
    }
  } else {
    if(target.data("visible")) {
      //console.log("no");
      target.data("visible", false);
    }
  }
}

Template.search.onRendered(function() {
  Session.setDefault('photosLimit', PHOTOS_INCREMENT);
  Tracker.autorun(() => {
    Meteor.subscribe('photos', Session.get('photosLimit'), Session.get("sortColor"), Session.get("filterProjectNo"), Session.get("startDate"), Session.get("endDate"));
  });
  $(".date-picker").datepicker({format:"dd/mm/yyyy"});
  //$("#form-date").datepicker().datepicker('setDate', new Date());
});

Template.search.onCreated(function() {
  Session.set('photosLimit', PHOTOS_INCREMENT);
  $("#photos-content").scroll(function() {
    showMoreVisible()
  });
});

Template.search.helpers({
  enddatedatenfilter: function() {
    if(Session.get("endDate")) {
      return moment(Session.get("endDate"),"DD/MM/YYYY").format('DD/MM/YYYY');
    }
    return "";
  },
  formattedDate: function(date) {
    if(!date) {
      return "n/a";
    }

    return moment(date).format('MMM D, YYYY');
  },
  formatFilepath: function() {
    link = "";
    if(BrowserDetect.OS == 'Windows' || BrowserDetect.OS == 'Mac') {
      link = this.replace(/\//g,'\\'); // replace forward slash with back slash
    }
    //if(BrowserDetect.browser == "Explorer" || BrowserDetect.browser == "Mozilla") {
    //  return "<a href='file:\\\\"+link+"'>"+link+"</a>";
    //}
    return link;
  },
  formattedImg: function() {
    if(this.width < 100 && this.height < 100) {
      return "<img src='data:image/jpg;base64,"+this.thumbnail+"' width='"+this.width+"' height='"+this.height+"' />";
    }
    return "<img src='data:image/jpg;base64,"+this.thumbnail+"' />";
  },
  hasLocation: function() {
    if(!this.location || this.location != null) {
      return false;
    }
    return true;
  },
  isSelectedColor: function(color) {
    if(Session.get('sortColor')) {
      if(color == Session.get('sortColor')) {
        return true;
      }
    }
    return false;
  },
  isSelectedPhoto: function() {
    if(Session.get('selectedPhoto')) {
      return (this._id == Session.get('selectedPhoto'));
    }
    return false;
  },
  morePhotos: function() {
    return !(Photos.find().count() < Session.get('photosLimit'))
  },
  photos: function() {
    sorter = {}
    if(Session.get("sortColor")) { sorter[Session.get("sortColor")] = -1 } else { sorter["datetaken"] = -1}
    return Photos.find({},{sort: sorter}).fetch();
  },
  projectnumberfilter: function() {
    return Session.get("filterProjectNo");
  },
  selectedPhoto: function() {
    return Photos.findOne({_id: Session.get('selectedPhoto')});
  },
  selectedColor: function() {
    if(Session.get('sortColor')) {
      //return Session.get('sortColor')+":"+this[Session.get('sortColor')].toFixed(4);
    }
    return "";
  },
  startdatedatenfilter: function() {
    if(Session.get("startDate")) {
      return moment(Session.get("startDate"),"DD/MM/YYYY").format('DD/MM/YYYY');
    }
    return "";
  }
});

Template.search.events({
  'click #btn-apply-projectno-filter': function(e) {
    e.preventDefault();
    Session.set('filterProjectNo',$("#projectno-filter").val());
    $("#photos-content").animate({ scrollTop: 0 }, "slow");
  },
  'click #btn-apply-datetaken-filter': function(e) {
    e.preventDefault();
    Session.set('startDate',$("#startdatetaken-filter").val());
    Session.set('endDate',$("#enddatetaken-filter").val());
    $("#photos-content").animate({ scrollTop: 0 }, "slow");
  },
  'click .close-side-view': function(e) {
    e.preventDefault();
    Session.set('selectedPhoto', "");
    $(".right-form").removeClass("show");
  },
  'click #clear-color-filter': function(e) {
    e.preventDefault();
    Session.set('sortColor',null);
    $("#photos-content").animate({ scrollTop: 0 }, "slow");
  },
  'click #clear-projectno-filter': function(e) {
    e.preventDefault();
    $("#projectno-filter").val("");
    Session.set('filterProjectNo',null);
    $("#photos-content").animate({ scrollTop: 0 }, "slow");
  },
  'click .photo-container': function(e) {
    e.preventDefault();
    var target = $(e.target);
    if(!$(e.target).hasClass('photo-container')) {
      target = $(e.target).closest('div.photo-container');
    }
    photoid = target.attr('photo-id');
    Session.set('selectedPhoto', photoid);
    $(".right-form").removeClass("show"); //hide all other forms
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
  },
  'click .set-color-filter': function(e) {
    e.preventDefault();
    var target = $(e.target);
    if(typeof target.attr('color') == 'undefined') {
      target = $(e.target).closest('div.color-filter-square');
    }
    color = target.attr('color');
    //console.log("Setting color to "+color);
    Session.set("sortColor", color);
    Session.set('photosLimit',PHOTOS_INCREMENT); // reset the number of images
    try{
      Photos.remove({}); // clear all local photos
    }catch(e) {
      //nuttin
    }
    $("#photos-content").animate({ scrollTop: 0 }, 100);
  }
});
