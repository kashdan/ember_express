var MyApp = Ember.Application.create();
MyApp.StateManager = Ember.StateManager.extend({
    rootElement: '#content'
});


MyApp.HomeView = Ember.View.extend({
    templateName : "welcome-home"
});

$(document).ready(function() {
    MyApp.stateManager = MyApp.StateManager.create({
        initialState : 'welcome',
        home : function() {
            this.goToState(this.initialState);
        },
        welcome: Ember.ViewState.create({
            view: MyApp.HomeView
        })
    });
});
MyApp.set('unicornsController', Ember.ArrayController.create({
    tagName:'tbody',
    content: [],
    dirty: 0,
    hasSelected : function() {
        this.set('dirty',false);
        return this.filterProperty('isSelected',true).length === 0;
    }.property('dirty'),
    findAll : function(q) {
        var self = this;
        if (q===undefined)
            q = {};
        return jQuery.ajax({
            url: '/unicorns',
            data : { query : q },
            dataType: 'json',
            type: 'GET'
        }).done( function(json) {
            self.set("content", []);
            for (var i=0; i < json.length; i++) {
                self.pushObject(MyApp.Unicorn.create(json[i]));
            }
        });
    },
    removeSelected : function() {
        this.forEach(function(obj) {
            if (obj.isSelected) {
                obj.destroy()
                .done(function() {
                    MyApp.unicornsController.removeObject(obj);
                });
            }
        });
    }
}));



// Your unicorn with some dummy attributes..
MyApp.Unicorn = Ember.Object.extend({
    stringAttr : '',
    referenceAttr : null,
    integerAttr: 0,
    booleanAttr: false,
    clone : function(target) {
        this.set('stringAttr',target.stringAttr);
        this.set('referenceAttr',target.referenceAttr);
        this.set('integerAttr',target.integerAttr); 
        this.set('booleanAttr',target.booleanAttr); 
    },
    verifyStringAttr : function() {
        return (/test/).test(this.stringAttr)===false;
    },
    save : function() {
        var self = this;
        return jQuery.ajax({
            url: '/unicorns' + (this._id !== undefined ? '/'+this._id : ''),
            data: {unicorn : { 
                stringAttr : this.stringAttr,
                referenceAttr : this.referenceAttr === null ? null : this.referenceAttr.id,
                booleanAttr : this.booleanAttr,
                integerAttr : this.integerAttr
            }},
            dataType: 'json',
            type: (this._id === undefined ? 'POST' : 'PUT')
        }).done( function(obj) {
            if (obj) {
                if (self._id === undefined)
                    self._id = obj._id;
            }
        });
    },
    destroy : function() {
        return jQuery.ajax({
            url: '/unicorns/' + this._id,
            dataType: 'json',
            type: 'DELETE'
        });
    }
});
MyApp.MainMenu = Ember.View.extend({
    templateName : "templates-mainmenu",
    tagName: "ul",
    classNames: ["nav"]
});

// This is just a sample controller to drive the select field.
// You can bind select fields to any other ArrayController.
MyApp.unicornSelectController = Ember.ArrayController.create({
    content: [
        Ember.Object.create({id:1,label:'Value1'}),
        Ember.Object.create({id:2,label:'Value2'}),
        Ember.Object.create({id:3,label:'Value3'}),
        Ember.Object.create({id:4,label:'Value4'})
    ]
});

// Unicorn form view
MyApp.UnicornView = Ember.View.extend({
    templateName : 'unicorns-form',
    item : null,
    triedToSubmit : false, // used to alert for errors
    isFailed : false,
    // Sample validation for one of the fields
    isStringError : function() {
        return this.item.verifyStringAttr()===false;
    }.property('item.stringAttr'),
    close : function() {
        $("#unicorn-dialog").modal('hide');
        this.remove();
    },
    didInsertElement: function() {
        $("#unicorn-dialog").modal();
    },
    isErroneous: function() {
        return this.get('isStringError') && this.get('triedSubmit');
    }.property('isStringError','triedSubmit')
});

// Extended unicorn form for new Unicorns
MyApp.NewUnicornView = MyApp.UnicornView.extend({
    submit : function() {
        this.set('triedSubmit',true);
        if (this.get('isErroneous')===false) {
            var self = this;
            this.item.save()
                .fail(function(e) {
                    self.set('isFailed',true);    
                })
                .done(function() {
                    MyApp.unicornsController.pushObject(self.item);
                    self.close();
                });
        }
    }
});

// Extended unicorn form for unicorn updates
MyApp.UpdateUnicornView = MyApp.UnicornView.extend({
    // this.actualItem will hold the living managed object,
    // while this.item holds a replicated, dummy copy.
    actualItem : null, 
    submit : function() {
        var item = this.item;
        var self = this;
        this.item.save()
            .fail( function(e) {
                self.set('isFailed',true);    
            })
            .done( function() {
                self.actualItem.clone(item);
                self.close();
            });
    }
});

// Unicorn table line
MyApp.UnicornItem = Ember.View.extend({
    templateName: 'unicorns-item',
    edit: function() {
        MyApp.UpdateUnicornView
            .create({      item : MyApp.Unicorn.create(this.item),
                     actualItem : this.item})
            .appendTo('#content');
    },
    selectionChanged : function() {
        MyApp.unicornsController.set('dirty',true);
    }.observes('item.isSelected')
});

// Unicorns table view
MyApp.UnicornsView = Ember.View.extend({
    templateName: 'unicorns-list',
    selectAll: false,
    updateSelected : function() {
        MyApp.unicornsController.setEach('isSelected',this.selectAll);
    }.observes('selectAll'),
    didInsertElement : function() {
        MyApp.unicornsController.findAll();
    }
});

// Append the Unicorn state to the global state manager
MyApp.StateManager.reopen({
    unicorns: Ember.ViewState.create({
        view: MyApp.UnicornsView
    })
});

MyApp.UnicornsMenuItem = Ember.View.extend({
    classNameBindings: ["active"],
    active: function() {
        return MyApp.stateManager.currentState.name=="unicorns";
    }.property("MyApp.stateManager.currentState"),
    select: function() {
        MyApp.stateManager.goToState("unicorns");
    }
});


MyApp.UnicornToolbar = Ember.View.extend({
    templateName: 'unicorns-toolbar',
    searchQuery: '',
    newUnicorn : function() {
        var v = MyApp.NewUnicornView.create({item:MyApp.Unicorn.create()});
        v.appendTo('#content');
    },
    delUnicorn : function() {
        MyApp.unicornsController.removeSelected();
    },
    filterBySearchQuery : function() {
        MyApp.unicornsController.findAll(this.searchQuery);
    }.observes('searchQuery')
});

