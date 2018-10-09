import moment from 'moment';

Meteor.publish('photos', function(limit,sort,projectNo,startDate,endDate,bdonly) {
  //console.log(limit+"; "+sort+"; "+projectNo+"; "+startDate+"; "+endDate+"; "+bdonly);
  var filter = {status: 'processed'};
  if(projectNo) {
    filter['projectno'] = projectNo;
  }
  datetaken = {}
  if(startDate && moment(startDate,"DD/MM/YYYY").isValid()) {
    datetaken["$gte"] = moment(startDate,"DD/MM/YYYY").toDate();
  }
  if(endDate && moment(endDate,"DD/MM/YYYY").isValid()) {
    datetaken["$lte"] = moment(endDate,"DD/MM/YYYY").toDate();
  }
  if(datetaken["$gte"] || datetaken["$lte"]) {
    filter['datetaken'] = datetaken
  }
  if(bdonly == "True") {
    filter['star'] = "True";
  }
  var sorter = {};
  if(sort && sort != "" && sort != null) {
    sorter[sort] = -1;
  }else{
    sorter['datetaken'] = -1;
  }
  var fields = {
    _id: 1,
    black: 1,
    blue: 1,
    brown: 1,
    cyan: 1,
    datefound: 1,
    datetaken: 1,
    //differencehash: 0,
    //directory: 0,
    filepaths: 1,
    green: 1,
    grey: 1,
    height: 1,
    labels: 1,
    orange: 1,
    pink: 1,
    projectno: 1,
    processeddate: 1,
    purple: 1,
    red: 1,
    //server: 0,
    star: 1,
    //status: 0,
    thumbnail: 1,
    white: 1,
    width: 1,
    yellow: 1
  }
  return Photos.find(filter, {limit: limit, sort: sorter, fields: fields});
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
