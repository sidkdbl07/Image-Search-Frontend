var exposed = FlowRouter.group({});
var authWebOnly = FlowRouter.group({
  triggersEnter: [function(context, redirect) {
    if(Meteor.userId()){
      if(Meteor.isCordova) {
        redirect('notfound');
      }
    }else{
      redirect('/login');
    }
  }]
});
var authOnly = FlowRouter.group({
  triggersEnter: [function(context, redirect) {
    if(!Meteor.userId()) {
      redirect('/login');
    }
  }]
});

exposed.route('/login', {
  name: 'Login',
  action: function() {
    BlazeLayout.render('mainlayout', { side: "blank", main: "login" });
  }
});

exposed.route('/', {
  name: 'Search',
  action: function() {
    BlazeLayout.render('mainlayout', { side: "sidenav", main: "search" });
  },
  subscriptions: function(params, queryParams) {
    this.register('user', Meteor.subscribe('singleuser', params.userid));
  }
});

authWebOnly.route('/user/:userid', {
  name: 'User',
  action: function() {
    BlazeLayout.render('mainlayout', { side: "sidenav", main: "user" });
  },
  subscriptions: function(params, queryParams) {
    this.register('user', Meteor.subscribe('singleuser', params.userid));
  }
});

authWebOnly.route('/users', {
  name: 'Users',
  action: function() {
    BlazeLayout.render('mainlayout', { side: "sidenav", main: "users" });
  }
});

FlowRouter.notfound = {
  name: "Not Found",
  action: function() {
    BlazeLayout.render('mainlayout', { side: "blank", main: "notfound" });
  }
};
