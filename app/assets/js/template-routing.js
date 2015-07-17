$(document).ready(function () {
	var navbar = $('.navbar');
	var links = $('link[rel="import"]');
	var loginForm = $(links.eq(0).get(0).import.getElementById('login-form'));
	var registrationForm = $(links.eq(2).get(0).import.getElementById('registration-form'));
	var mainContainer =  $(links.eq(1).get(0).import.getElementById('main-container'));

	

	loginForm.find('#sign-in').click(function () {
		loginForm = $('#login-form').detach();
		mainContainer.insertAfter(navbar);
	});
	loginForm.find('#register').click(function(){
		loginForm = $('#login-form').detach();
		registrationForm.insertAfter(navbar);
	});
	registrationForm.find('#registration').click(function(){
		registrationForm = $('#registration-form').detach();
		mainContainer.insertAfter(navbar);
	});

	activateOffcanvas(mainContainer);

	loginForm.insertAfter(navbar);
});