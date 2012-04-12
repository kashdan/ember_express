MyApp.UnicornsMenuItem = Ember.View.extend({
    classNameBindings: ["active"],
    active: function() {
        return MyApp.stateManager.currentState.name=="unicorns";
    }.property("MyApp.stateManager.currentState"),
    select: function() {
        MyApp.stateManager.goToState("unicorns");
    }
});


