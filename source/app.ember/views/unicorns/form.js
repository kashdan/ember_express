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

