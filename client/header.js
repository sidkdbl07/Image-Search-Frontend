import moment from 'moment';

Template.header.onRendered(function() {

});

Template.header.helpers({
  color: function() {
    if(Session.get("sortColor")) {
      return Session.get("sortColor")
    }
    return "black";
  },
  dateFilterRange: function() {
    if(!Session.get("startDate") && !Session.get("endDate")) { return "All"; }
    if(Session.get("startDate") && !Session.get("endDate")) { return moment(Session.get("startDate"),"DD/MM/YYYY").format("MMM DD, YYYY")+" to present"; }
    if(!Session.get("startDate") && Session.get("endDate")) { return "All until "+moment(Session.get("startDate"),"DD/MM/YYYY").format("MMM DD, YYYY"); }
    if(Session.get("startDate") && Session.get("endDate")) { return moment(Session.get("startDate"),"DD/MM/YYYY").format("MMM Do, YYYY")+"<span class='filter-label'> to </span>"+moment(Session.get("endDate"),"DD/MM/YYYY").format("MMM Do, YYYY"); }
    return "Boo"
  },
  isColorSelected: function() {
    if(Session.get('sortColor')) {
      return true;
    }
    return false;
  },
  isDateTakenSelected: function() {
    if(Session.get('startDate') || Session.get('endDate')) {
      return true;
    }
    return false;
  },
  isProjectNumberSelected: function() {
    if(Session.get('filterProjectNo')) {
      return true;
    }
    return false;
  },
  isStarredSelected: function() {
    if(Session.get("bdonly") == "True") {
      return true;
    }
    return false;
  },
  projectnumberfilter: function() {
    return Session.get("filterProjectNo");
  },
  'username': function(){
    return Meteor.user.firstname;
  },
});

Template.header.events({
  'click #btn-clear-filters': function(e) {
    e.preventDefault();
    Session.set("filterProjectNo",null);
    Session.set("endDate",null);
    Session.set("startDate",null);
    Session.set("sortColor",null);
    Session.set('photosLimit',128);
    Session.set('bdonly',"");
    $("#photos-content").animate({ scrollTop: 0 }, "slow");
  },
  'click #btn-open-filter': function(e) {
    e.preventDefault();
    $("#filter-view").addClass("show");
  }
});
