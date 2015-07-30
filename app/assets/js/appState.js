var appState = (function () {
	var instance;
	function init() {
		var navbar = $('.navbar');
		var links = $('link[rel="import"]');
		var loginForm = $(links.eq(0).get(0).import.getElementById('login-form'));
		var registrationForm = $(links.eq(2).get(0).import.getElementById('registration-form'));
		var mainContainer =  $(links.eq(1).get(0).import.getElementById('main-container'));
		var user;
		var avatar;
		function privateMethod(){
			console.log( "I am private" );
		}
		var privateVariable = "Im also private";
		return {
			changePage: (function (navb){
				return function (oldPage, newPage) {
					oldPage = oldPage.detach();
					newPage.insertAfter(navb);
				}
			})(navbar),
			getNavbar: function(){
				return navbar;
			},
			getLoginForm: function(){
				return loginForm;
			},
			getRegistrationForm: function(){
				return registrationForm;
			},
			getMainContainer: function(){
				return mainContainer;
			},
			getUser: function(){
				return user;
			},
			getAvatar: function(){
				return avatar;
			},
			setUser: function(obj){
				user = obj;
			},
			setAvatar: function(public_id){
				avatar = public_id;
			}
		};
	};
	return {
		// Get the Singleton instance if one exists
    	// or create one if it doesn't
    	getInstance: function () {
    		if ( !instance ) {
    			instance = init();
    		}
    		return instance;
    	}
    };
})();