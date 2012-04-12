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

