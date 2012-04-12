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



