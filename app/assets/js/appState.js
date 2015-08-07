var appState = (function () {
	var instance;
	function init() {
		var navbar = $('.navbar');
		var links = $('link[rel="import"]');
		var loginForm = $(links.eq(0).get(0).import.getElementById('login-form'));
		var registrationForm = $(links.eq(2).get(0).import.getElementById('registration-form'));
		var mainContainer =  $(links.eq(1).get(0).import.getElementById('main-container'));
		var registerCafeForm = $(links.eq(3).get(0).import.getElementById('register-cafe-form'));
		var registerSentPhoto = $(links.eq(4).get(0).import.getElementById('register-sent-photo').innerHTML);
		var mapContainer = mainContainer.find('#map-container');
		var cafePage = $(links.eq(5).get(0).import.getElementById('cafe-page'));
		var user;
		var avatar;
		var photoes;
		var currentPage = loginForm;
		var currentData = mapContainer;
		function privateMethod(){
			console.log( "I am private" );
		}
		var privateVariable = "Im also private";
		return {
			changePage: (function (navb){
				return function (newPage) {
					if(currentPage != newPage){
						currentPage.detach();
						newPage.insertAfter(navb);
						currentPage = newPage;
					}
				};
			})(navbar),
			changeData: function(newData){
				if(currentPage === mainContainer){
					currentData.detach();
					$('#data').append(newData);
					currentData = newData;
				}
			},
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
			getRegisterCafeForm: function(){
				return registerCafeForm;
			},
			getCurrentPage: function(){
				return currentPage;
			},
			getUser: function(){
				return user;
			},
			getAvatar: function(){
				return avatar;
			},
			getPhotoes: function(){
				return photoes;
			},
			getMapContainer: function(){
				return mapContainer;
			},
			getCafePage: function(){
				return cafePage;
			},
			getCurrentData: function(){
				return currentData;
			},
			setUser: function(obj){
				user = obj;
			},
			setAvatar: function(public_id){
				avatar = public_id;
			},
			setPhotoes: function(phot){
				photoes = phot;
			},
			makePhotoForm: function(public_id){
				var s = registerSentPhoto.clone();
				s.find('.form-control').addClass(public_id);
				return s;
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