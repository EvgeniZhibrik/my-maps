$(document).ready(function () {
	var navbar = $('.navbar');
	var links = $('link[rel="import"]');
	var loginForm = $(links.eq(0).get(0).import.getElementById('login-form'));
	var registrationForm = $(links.eq(2).get(0).import.getElementById('registration-form'));
	var mainContainer =  $(links.eq(1).get(0).import.getElementById('main-container'));
	var user;

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

	var changePage = (function (navb){
		return function (oldPage, newPage) {
			oldPage = oldPage.detach();
			newPage.insertAfter(navb);
		}
	})(navbar);

	navbar.find('#exit').click(function(){
		if($('#main-container').length){
			logout({email: user.email}, function(json){
				user = null;
				console.log(json);
				changePage(mainContainer, loginForm);
			});
		}
	});

	loginForm.find('#sign-in').click(function(){
		login ($('#input-email').val(), $('#input-password').val(), function(json){
			changePage(loginForm, mainContainer);
			user = json;
			setUserData(user);
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
			registration(newUser, function(json){
				console.log(json);
				login (json.email, json.password, function(json){
					changePage(registrationForm, mainContainer);
					user = json;
					setUserData(user);
				});
			});
		}
	});

	activateOffcanvas(mainContainer);

	loginForm.insertAfter(navbar);
});