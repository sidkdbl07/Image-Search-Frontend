import moment from 'moment';

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
                photos: Photos.find({status: 'new', server: server},{limit: 200, sort: {datefound: 1}}).fetch()};
      }
    }
  });

  api.addRoute('newphotos/:server/:numphotos', {authRequired: false}, {
    get: {
      authRequired: false,
      action: function() {
        var server = decodeURIComponent(this.urlParams.server);
        var num = parseInt(this.urlParams.numphotos);
        return {total_new_photos: Photos.find({status: 'new', server: server}).count(),
                photos: Photos.find({status: 'new', server: server},{limit: num, sort: {datefound: 1}}).fetch()};
      }
    }
  });

  api.addCollection(Photos, {
    authRequired: false,
    //excludedEndpoints: ['getAll'],
    endpoints: {
      post: {
        action: function() {
          var fp = this.bodyParams.filepath;
          var existing = Photos.find({filepaths: { "$in": [fp]}}).count();
          if(existing == 0) {
            this.bodyParams['status'] = 'new';
            this.bodyParams['filepaths'] = [fp];
            delete this.bodyParams.filepath;
            Photos.insert(this.bodyParams);
            return {status: "success", message: "added"};
          }
          return {status: "success", message: "duplicate"};
        }
      },
      patch: {
        action: function() {
          var photo = Photos.findOne({_id: this.bodyParams['_id']});
          if(photo) {
            // Arg!! Python has issues with sending arrays so we have to rebuild
            // the filepaths array.
            files = []
            if(Array.isArray(this.bodyParams['filepaths'])) {
              this.bodyParams['filepaths'].forEach(function(f) {
                files.append(f);
              });
            }else{
              files = [ this.bodyParams['filepaths'] ];
            }
            this.bodyParams["filepaths"] = files;
            // Look to see if the photo exists somewhere else. To do this, we
            // compare the difference hash. Theoretically, the difference hash
            // should be the same even if you resize the image.
            same_photo = Photos.findOne({differencehash: this.bodyParams["differencehash"]});
            if(same_photo) {
              same_photo.filepaths.push(this.bodyParams['filepaths'][0])
              Photos.update({_id: same_photo._id}, same_photo);
              Photos.remove(this.bodyParams['_id']);
              //console.log("Duplicate found: "+this.bodyParams['filepaths'][0]+" is also found in "+same_photo.filepaths[0]);
              return {status: "success", message: "appended"};
            }
            // Arg again! Numbers get sent as text, so we need to turn them
            // back to numbers
            var keys = Object.keys(this.bodyParams);
            //console.log(keys)
            var vals = Object.values(this.bodyParams);
            for(var i=0; i<keys.length; i++) {
              //console.log("Accessing "+i);
              try {
                if(!isNaN(vals[i])) {
                  //console.log("Testing "+keys[i]+" "+vals[i]);
                  this.bodyParams[keys[i]] = Number.parseFloat(vals[i]);
                }
              } catch(e) {
                //console.log(e)
                continue;
              }
              // Change text dates to real dates
              if(keys[i] == "datetaken") {
                d = moment(vals[i],"YYYY:MM:Do hh:mm:ss")
                if(d.isValid && moment().diff(d,'days') < 10000 ) {
                  this.bodyParams[keys[i]] = d.toDate();
                }else{
                  this.bodyParams[keys[i]] = "n/a"
                }
              }
            }
            //console.log(this.bodyParams);

            Photos.update({_id: photo._id}, this.bodyParams);
            return {status: "success", message: "updated"};
          }
          return {status: "error", message: "photo not found"}
        }
      }
    }
  });



}
