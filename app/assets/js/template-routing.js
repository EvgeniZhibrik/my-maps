$(document).ready(function () {
	var app = appState.getInstance();
	app.getNavbar().find('#exit').click(function(){
		if(app.getUser()){
			logout({email: app.getUser().email}, function(json){
				cleanMainContainer();
				app.setUser(null);
				console.log(json);
				app.changePage(app.getMainContainer(), app.getLoginForm());
			});
		}
	});

	app.getLoginForm().find('#input-email').on('keyup', function(e){
		if(validateEmail($(this).val()))
			$(this).parents('.has-feedback').removeClass('has-error').addClass('has-success');
		else if(!($(this).val()) || $(this).val() === "")
			$(this).parents('.has-feedback').removeClass('has-error').removeClass('has-success');
		else
			$(this).parents('.has-feedback').addClass('has-error').removeClass('has-success');
		if($('.has-success').length == 2)
			$('#sign-in').removeAttr('disabled');
		else
			$('#sign-in').attr('disabled', 'disabled');
	});

	app.getLoginForm().find('#input-password').on('keyup', function(e){
		if(!($(this).val()) || $(this).val() === "")
			$(this).parents('.has-feedback').removeClass('has-success');
		else
			$(this).parents('.has-feedback').addClass('has-success');
		if($('.has-success').length == 2)
			$('#sign-in').removeAttr('disabled');
		else
			$('#sign-in').attr('disabled', 'disabled');
	});
	
	app.getLoginForm().find('#sign-in').click(function(){
		login ($('#input-email').val(), $('#input-password').val(), function(json){
			cleanLoginForm();
			app.changePage(app.getLoginForm(), app.getMainContainer());
			app.setUser(json);
			setUserData(app.getUser());
		});
	});

	app.getLoginForm().find('#register').click(function(){
		getUploadTag(function(json){
			var uplForm = app.getRegistrationForm().find('.upload-form');
			app.changePage(app.getLoginForm(), app.getRegistrationForm());
			setupUploadInput(json.tag, uplForm, app);
		});	
	});
	
	app.getRegistrationForm().find('#registration').click(function(){
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
				avatar: app.getAvatar(),
				details: {
					birthday: $('#reg-bday').val()
				}
			};
			app.setAvatar(null);
			registration(newUser, function(json){
				console.log(json);
				login (json.email, json.password, function(json){
					app.changePage(app.getRegistrationForm(), app.getMainContainer());
					app.setUser(json);
					setUserData(app.getUser());
				});
			});
		}
	});

	app.getRegistrationForm().find('#reg-cancel').click(function(e){
		cleanRegistrationForm();
		app.changePage(app.getRegistrationForm(), app.getLoginForm());
	});


	
	app.getLoginForm().insertAfter(app.getNavbar());
	activateOffcanvas(app.getMainContainer());

	
});