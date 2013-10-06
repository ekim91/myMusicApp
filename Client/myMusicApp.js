if(Meteor.isClient){

PlayLists = new Meteor.Collection("PlayLists");
jplayer = new Meteor.Collection("jplayer");
//Id for current PlayList
Session.setDefault('PlayLists_id', null);
//Editing the PlayList by ID
Session.setDefault('edit_PlayListname', null);


var listsHandle = Meteor.subscribe('PlayLists', function () {
  if (!Session.get('PlayLists_id')) {
    var list = PlayLists.findOne({}, {sort: {name: 1}});
    if (PlayList)
      Router.setList(PlayLists._id);
  }
});

Template.PlayLists.selected = function () {
  return Session.equals('PlayLists_id', this._id) ? 'selected' : '';
};

Template.PlayLists.name_class = function () {
  return this.name ? '' : 'empty';
};

Template.PlayLists.editing = function () {
  return Session.equals('editing_PlayListname', this._id);
};


$("#jquery_jplayer_1").jplayer({
    ready: function(event){
      $(this).jplayer("setMedia",
        {
        mp3: "http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.mp3",
        wav: "http://www.jplayer.org/audio/ogg/Miaow-07-Bubble.wav"
        });
    },
    swfPath:"http://jplayer.org/latest/js",
    supplied: "mp3, wav",
    smoothPlayBar: true,
    keyEnabled: true,
  ready: function(event){
  var myPlaylist = new jPlayerPlasylist({
    jPlayer: "#jquery_jplayer_1",
    cssSelectorAncestor:"#jp_container_1"
  }, [
      {
        title: "Current Song",
        artitst: "Current Artist",
        mp3: "http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.mp3",
        wav: "http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.wav"
      }
  ],{
    playlistOptions :{
      autoPlay : false,
      enableRemoveControls: true,
      shuffleOnLoop: true,
      displayTime: 'slow',
      addTime:'fast',
      removeTime:'fast',
      shuffleTime: 'slow'
    },
  });
}
});


Template.jplayer.jplayer = function(){
  return jplayer.ready();
}

Template.PlayLists.Loading = function() {
  return !ListsHandle.ready();
}

Template.PlayLists.PlayLists = function () {
  return PlayLists.find({}, {sort: {name: 1}});
};

Template.PlayLists.events({
  'mousedown .PlayList': function (evt) { 
    Router.setList(this._id);
  },
  'click .PlayList': function (evt) {
    evt.preventDefault();
  },
  'dblclick .PlayList': function (evt, tmpl) { 
    Session.set('editing_PlayListname', this._id);
    Deps.flush();
    activateInput(tmpl.find("#PlayList-name-input"));
  }
});

Template.PlayLists.events(okCancelEvents(
  '#new-PlayList',
  {
    ok: function (text, evt) {
      var id = PlayList.insert({name: text});
      Router.setList(id);
      evt.target.value = "";
    }
  }));

Template.lists.events(okCancelEvents(
  '#PlayList-name-input',
  {
    ok: function (value) {
      PlayLists.update(this._id, {$set: {name: value}});
      Session.set('editing_PlayListname', null);
    },
    cancel: function () {
      Session.set('editing_PlayListname', null);
    }
  }));
}

var myMusicAppRouter = Backbone.Router.extend({
  routes: {
    ":PlayLists_id": "main"
  },
  main: function (PlayLists_id) {
    var oldPlayList = Session.get("PlayLists_id");
    if (oldPlayList !== PlayLists_id) {
      Session.set("PlayLists_id", PlayLists_id);
    }
  },
  setPlayList: function (PlayLists_id) {
    this.navigate(PlayLists_id, true);
  }
});

Router = new myMusicAppRouter;
if(Meteor.isServer){
Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});
}
