function getUploadTag(callback){
	$.ajax({
		url: "http://localhost:8000/api/v1.0/upload/",
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
	var mainHtml = $('<h3>' + user.firstName + ' ' + user.lastName + '</h3>');
	$('#inform').html(mainHtml);
	addInfo(user.details);
}

function addInfo(info){
	var s = $('#additional-user-info');
	for (item in info){
		s.append('<div class = "row"><div class = "col-xs-5 info-name">' + item + '</div><div class = "col-xs-7">' + info[item] + '</div></div>');
	}
}

