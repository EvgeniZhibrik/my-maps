$(document).ready(function () {
	var navbar = $('.navbar');
	var links = $('link[rel="import"]');
	var loginForm = $(links.eq(0).get(0).import.getElementById('login-form'));
	var registrationForm = $(links.eq(2).get(0).import.getElementById('registration-form'));
	var mainContainer =  $(links.eq(1).get(0).import.getElementById('main-container'));

	navbar.find('#exit').click(function(){
		if($('#main-container').length){
			mainContainer = $('#main-container').detach();
			loginForm.insertAfter(navbar);
		}
	});

	loginForm.find('#sign-in').click(function () {
		$.ajax({
			url: "http://localhost:8000/api/v1.0/",
			type: "GET",
			dataType : "json",
			success: function( json ) {
				console.log(json);
				loginForm = $('#login-form').detach();
				mainContainer.insertAfter(navbar);	
			},
			error: function( xhr, status, errorThrown ) {
				alert( "Sorry, there was a problem!" );
				console.log( "Error: " + errorThrown );
				console.log( "Status: " + status );
			},
		});		
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