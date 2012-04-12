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
