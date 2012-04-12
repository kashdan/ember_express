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

