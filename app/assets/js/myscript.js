function getUploadTag(callback){
	$.ajax({
		url: "http://localhost:8000/api/v1.0/upload_tag/",
		type: "GET",
		dataType : "json",
		success: function(json){
			callback(json);
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

function cleanLoginForm(){
	$('#input-email').val('').parents('.has-feedback').removeClass('has-error').removeClass('has-success');
	$('#input-password').val('').parents('.has-feedback').removeClass('has-success');
	$('#sign-in').attr('disabled', 'disabled');
}

function cleanMainContainer(){
	$('#additional-user-info').html('');
}

function cleanRegistrationForm(){
	$('.form-control').val('');
	$('.upload-form').html('');
}

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




function login(username, password, callback) {
	$.ajax({
		url: "http://localhost:8000/api/v1.0/user/login/",
		type: "POST",
		dataType : "json",
		data: {
			username: username,
			password: password
		},
		success: function( json ) {
			console.log(json);
			callback(json);
		},
		error: function( xhr, status, errorThrown ) {
			alert( "Sorry, there was a problem!" );
			console.log( "Error: " + errorThrown );
			console.log( "Status: " + status );
			console.log(xhr);
		}
	});		
}

function registration(newUser, callback){
	$.ajax({
		url: "http://localhost:8000/api/v1.0/user/register/",
		type: "POST",
		dataType : "json",
		data: newUser,
		success: function(json){
			callback( json );
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

function logout(email, callback){
	$.ajax({
		url: "http://localhost:8000/api/v1.0/user/logout/",
		type: "POST",
		dataType : "json",
		data: email,
		success: function(json){
			callback(json);
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

function setUserData(user){
	$('#ava').html($.cloudinary.image(user.avatar, {
		alt: "ava here"
	}));
	$('#ava img').addClass('img-responsive');
	var mainHtml = $('<h3>' + user.firstName + ' ' + user.lastName + '</h3>');
	$('#inform').html(mainHtml);
	addInfo(user.details);
}

function addInfo(info){
	var s = $('#additional-user-info');
	for (item in info){
		if(item === 'birthday'){
			var t = new Date(info[item]);
			s.append('<div class = "row"><div class = "col-xs-5 info-name">' + item + '</div><div class = "col-xs-7">' + t.toLocaleDateString() + '</div></div>');
		}
		else
			s.append('<div class = "row"><div class = "col-xs-5 info-name">' + item + '</div><div class = "col-xs-7">' + info[item] + '</div></div>');
	}
}

function deleteNotStoredAvatar(public_id, callback){
	$.ajax({
		url: "http://localhost:8000/api/v1.0/image/"+public_id+"/false/",
		type: "DELETE",
		dataType : "json",
		success: function(json){
			callback && callback(json);
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

function setupUploadInput(tag, uplForm, app){
	uplForm.append($(tag));
	uplForm.append($('<div class="preview"></div><div class = "progress-bar"><div class = "progress"></div></div>'));
	var inp = $("input.cloudinary-fileupload[type=file]");
	inp.cloudinary_fileupload();
	var progr = $('.progress');
	progr.hide();
	inp.on('cloudinarystart', function(e){
		$('.preview').html('');
		if(app.getAvatar()){
			deleteNotStoredAvatar(app.getAvatar());
			app.setAvatar(null);
		}
		progr.show();
	});
	inp.on('fileuploadprogress', function(e,data){
		progr.css('width', Math.round((data.loaded * 100.0) / data.total) + '%');
	});
	inp.on('cloudinarydone', function(e, data) {
		progr.hide();
		$('.preview').html( $.cloudinary.image(data.result.public_id, { 
			format: data.result.format, 
			version: data.result.version, 
			crop: 'fit', 
			width: 150, 
			height: 100 
		}));
		app.setAvatar(data.result.public_id);
	});
}

function validateEmail(email) 
{
    var re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return re.test(email);
}