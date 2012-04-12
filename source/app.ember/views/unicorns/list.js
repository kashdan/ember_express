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

