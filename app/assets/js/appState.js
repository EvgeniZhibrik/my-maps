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
		var comment = $(links.eq(6).get(0).import.getElementsByClassName('comment')[0]);
		var mapFilter = $(links.eq(7).get(0).import.getElementById('map-filter-form'));
		var user;
		var avatar;
		var photoes;
		var currentPage;
		var currentData;
		var currentFilter;
				
		return {
			changePage: (function (navb){
				return function (newPage) {
					if(currentData){
						currentData.detach();
						currentData = null;
					}
					if (currentPage)
						currentPage.detach();
					newPage.insertAfter(navb);
					currentPage = newPage;
					if(classMap.check())
						classMap.getInstance().reloadMap();
				};
			})(navbar),
			changeData: function(newData){
					if(currentData){
						currentData.detach();
						currentData = null;
					}
					else
						$('#map-container').detach();
					$('#data').append(newData);
					currentData = newData;
					$('#myCarousel').addClass('slide');
					if(classMap.check())
						classMap.getInstance().reloadMap();
			},
			changeFilter: function(newFilter){
				if (currentFilter){
					currentFilter.detach();
					currentFilter = null;
				}
				$('#right-sidebar').append(newFilter);
				currentFilter = newFilter;

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
			getComment: function(){
				return comment;
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
			getMapFilter: function(){
				return mapFilter;
			},
			makePhotoForm: function(public_id){
				var s = registerSentPhoto.clone(true);
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