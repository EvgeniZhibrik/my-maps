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
		var user;
		var avatar;
		var photoes;
		var currentPage = loginForm;
		var currentData = mapContainer;
		function clearData() {
			if (currentPage === mainContainer && currentData === cafePage){
				currentPage.find('.slide').removeClass('slide');
				currentData.find('.carousel-inner').html('');
				currentData.find('#cafe-name').html('');
				currentData.find('#cafe-rating').html('');
				currentData.find('#cafe-description').html('');
				currentData.find('#comments').html('');
			}
			else if (currentPage === mainContainer && currentData === mapContainer){
				closeMap();
				initMap();
			}
		}

		function clearPage() {
			clearData();
			if(currentPage === loginForm){
				currentPage.find('#input-email').val('').parents('.has-feedback').removeClass('has-error').removeClass('has-success');
				currentPage.find('#input-password').val('').parents('.has-feedback').removeClass('has-success');
				currentPage.find('#sign-in').attr('disabled', 'disabled');
			}
			else if (currentPage === registrationForm){
				currentPage.find('.form-control').val('');
				currentPage.find('.upload-form').html('');
			}
			else if (currentPage === mainContainer){
				currentPage.find('#additional-user-info').html('');
			}
			else if (currentPage === registerCafeForm){
				currentPage.find('.form-control').val('');
				currentPage.find('.upload-form').html('');
			}
		}
		
		return {
			changePage: (function (navb){
				return function (newPage) {
					if(currentPage != newPage){
						clearPage();
						currentPage.detach();
						newPage.insertAfter(navb);
						currentPage = newPage;
					}
				};
			})(navbar),
			changeData: function(newData){

				if(currentPage === mainContainer){
					clearData();
					currentData.detach();
					$('#data').append(newData);
					currentData = newData;
				}
				if(newData === cafePage){
					currentData.find('#myCarousel').addClass('slide');
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