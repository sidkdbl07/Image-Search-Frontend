if(Meteor.isServer) {
  var api = new Restivus({
    prettyJson: true
  });

  api.addRoute('newphotos/:server', {authRequired: false}, {
    get: {
      authRequired: false,
      action: function() {
        var server = decodeURIComponent(this.urlParams.server);
        return {total_new_photos: Photos.find({status: 'new', server: server}).count(),
                photos: Photos.find({status: 'new', server: server},{limit: 100, sort: {datefound: 1}}).fetch()};
      }
    }
  });

  api.addCollection(Photos, {
    authRequired: false,
    excludedEndpoints: ['getAll'],
    endpoints: {
      post: {
        action: function() {
          var server = decodeURIComponent(this.urlParams.server);
          var existing = Photos.find({serverpath: server}).count();
          if(existing == 0) {
            this.bodyParams['status'] = 'new';
            Photos.insert(this.bodyParams);
            return {status: "success", message: "added"};
          }
          return {status: "success", message: "duplicate"};
        }
      }
    }
  });



}
