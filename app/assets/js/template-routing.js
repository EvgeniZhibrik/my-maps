$(document).ready(function () {
	var app = appState.getInstance();
	app.getNavbar().find('#exit').click(function(){
		if(app.getUser()){
			logout({email: app.getUser().email}, function(json){
				app.setUser(null);
				console.log(json);
				closeMap();
				initMap();
				app.changePage(app.getLoginForm());
			});
		}
	});

	app.getCafePage().find('#send-cafe-comment-button').click(function(e){
		sendComment($(this).attr('cafe-id'));
	});

	app.getLoginForm().find('#input-email').on('change keyup click', function(e){
		validateInputForm(this);
	});

	app.getLoginForm().find('#input-password').on('change keyup', function(e){
		validateInputForm(this);
	});
	
	app.getLoginForm().find('#sign-in').click(function(){
		login ($('#input-email').val(), $('#input-password').val(), function(json){
			app.changePage(app.getMainContainer());
			app.changeData(app.getMapContainer());
			app.setUser(json);
			setUserData(app.getUser());
		});
	});

	app.getLoginForm().find('#register').click(function(){
		getUploadTag(function(json){
			var uplForm = app.getRegistrationForm().find('.upload-form');
			app.changePage(app.getRegistrationForm());
			setupUploadAvatarInput(json.tag, uplForm, app);
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
					app.changePage(app.getMainContainer());
					app.changeData(app.getMapContainer());
					app.setUser(json);
					setUserData(app.getUser());
				});
			});
		}
	});

	app.getRegistrationForm().find('#reg-cancel').click(function(e){
		app.changePage(app.getLoginForm());
	});

	app.getMainContainer().find('#add-cafe-btn').click(function(e){
		getUploadTag(function(json){
			var uplForm = app.getRegisterCafeForm().find('.upload-form');
			app.changePage(app.getRegisterCafeForm());
			setupUploadInput(json.tag, uplForm, app);
		});
	});
	
	app.getRegisterCafeForm().find('#reg-cafe-cancel').click(function(e){
		app.changePage(app.getMainContainer());
		app.changeData(app.getMapContainer());
		
	});

	app.getRegisterCafeForm().find('#register-cafe').click(function(e){
		var newCafe = {
			name: $('#reg-cafe-name').val(),
			description: $('#reg-cafe-description').val(),
			website: $('#reg-cafe-website').val(),
			coordinates: {
				latitude: $('#reg-latitude').val(),
                longitude: $('#reg-longitude').val()
            },
            publishedBy: app.getUser()._id,
            published: new Date(),
            menu: {}
		};
		var f = app.getPhotoes().reduceRight(function(prev, curr, ind, arr){
			return function(id){
				
				var newPhoto = {
					title: $('input.'+ curr).val(),
					description: $('textarea.' + curr).val(),
					cafeID: id,
					publishedBy: app.getUser()._id,
					published: new Date(),
                	link: curr
				};
				sendNewPhoto(newPhoto, function(json){
					console.log('json');
					prev(id);
				});
			};
		}, function(){
			closeMap();
			initMap();
			app.changePage(app.getMainContainer());
			app.changeData(app.getMapContainer());
		});
		registerCafe(newCafe, function(json){
				console.log(json);
				f(json._id);
		});
	});

	app.getMainContainer().find('#map-menu-button').click(function(e){
		app.changeData(app.getMapContainer());
		$('.row-offcanvas').removeClass('active1').removeClass('active2');
	});

	
	
	app.getCurrentPage().insertAfter(app.getNavbar());
	activateOffcanvas(app.getMainContainer());
	validateInputForm($('#input-email'));
	validateInputForm($('#input-password'));


	
});