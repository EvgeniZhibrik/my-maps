$(document).ready(function () {
	var navbar = $('.navbar');
	var links = $('link[rel="import"]');
	var loginForm = $(links.eq(0).get(0).import.getElementById('login-form'));
	var registrationForm = $(links.eq(2).get(0).import.getElementById('registration-form'));
	var mainContainer =  $(links.eq(1).get(0).import.getElementById('main-container'));

	function registerFormValid(){
		var inp = $('.form-control');
		inp.each(function(ind, elem){
			if(!$(elem).val())
				return 1;
		});
		if($('#reg-email1').val() != $('#reg-email2').val())
			return 2;
		if($('#reg-password1').val() != $('#reg-password2').val())
			return 3;
		return 0;

	}


	navbar.find('#exit').click(function(){
		if($('#main-container').length){
			mainContainer = $('#main-container').detach();
			loginForm.insertAfter(navbar);
		}
	});

	loginForm.find('#sign-in').click(function () {
		$.ajax({
			url: "http://localhost:8000/api/v1.0/user/login/",
			type: "POST",
			dataType : "json",
			data: {
				email: $('#input-email').val(),
				password: $('#input-password').val()
			},
			success: function( json ) {
				console.log(json);
				loginForm = $('#login-form').detach();
				mainContainer.insertAfter(navbar);	
			},
			error: function( xhr, status, errorThrown ) {
				alert( "Sorry, there was a problem!" );
				console.log( "Error: " + errorThrown );
				console.log( "Status: " + status );
			}
		});		
	});
	loginForm.find('#register').click(function(){
		loginForm = $('#login-form').detach();
		registrationForm.insertAfter(navbar);
	});
	registrationForm.find('#registration').click(function(){
		var c = registerFormValid();
		switch(c){
		case 1:
			fillAllInputs();
			break;
		case 2:
			checkOutEmail();
			break;
		case 3:
			checkOutPassword();
			break;
		case 0:
		default:
			var newUser = {
				email: $('#reg-email1').val(),
				password: $('#reg-password1').val(),
				firstName: $('#reg-first-name').val(),
				lastName: $('#reg-last-name').val(),
				details: {
					birthday: $('#reg-bday').val()
				}
			};
			$.ajax({
				url: "http://localhost:8000/api/v1.0/user/register/",
				type: "POST",
				dataType : "json",
				data: newUser,
				success: function( json ) {
					console.log(json);
					registrationForm = $('#registration-form').detach();
					mainContainer.insertAfter(navbar);
				},
				error: function( xhr, status, errorThrown ) {
					alert( "Sorry, there was a problem!" );
					console.log( "Error: " + errorThrown );
					console.log( "Status: " + status );
					console.log(xhr);
					//handleRegistrationError(xhr);
				}
			});
		}
	});

	activateOffcanvas(mainContainer);

	loginForm.insertAfter(navbar);
});