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
}

function cleanMainContainer(){
	
}

function cleanRegistrationForm(){
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

function cleanRegisterCafeForm(){
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
	
	$('#inform').html(user.firstName + ' ' + user.lastName);
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
			s.append('<div class = "row"><div class = "col-xs-5 info-name font-responsive">' + item + '</div><div class = "col-xs-7 font-responsive">' + info[item] + '</div></div>');
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

function setupUploadAvatarInput(tag, uplForm, app){
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

function setupUploadInput(tag, uplForm, app){
	uplForm.append($(tag));
	uplForm.append($('<div class="preview"></div><div class = "progress-bar"><div class = "progress"></div></div>'));
	var inp = $("input.cloudinary-fileupload[type=file]");
	inp.attr('multiple', 'multiple');
	inp.cloudinary_fileupload();
	var progr = $('.progress');
	progr.hide();
	var photoes = [];
	inp.on('cloudinarystart', function(e){
		if(app.getPhotoes()){
			var f = app.getPhotoes().reduceRight(function(prev,cur, ind, arr){
				return function(){
					deleteNotStoredAvatar(cur, prev);
				};
			}, 
			function(){ 
				console.log('DELETED!!!');
			});
			f();
		}

		$('.preview').html('');
		progr.show();
	});
	inp.on('fileuploadprogressall', function(e,data){
		progr.css('width', Math.round((data.loaded * 100.0) / data.total) + '%');
	});
	inp.on('cloudinarydone', function(e, data) {
		$('.preview').append( $.cloudinary.image(data.result.public_id, { 
			format: data.result.format, 
			version: data.result.version, 
			crop: 'fit', 
			width: 150, 
			height: 100 
		})).append(app.makePhotoForm(data.result.public_id));

		photoes.push(data.result.public_id);
	});
	inp.on('cloudinarystop', function(e, data){
		app.setPhotoes(photoes);
	});
}


function registerCafe(newCafe,callback){
	$.ajax({
		url: "http://localhost:8000/api/v1.0/cafe/",
		type: "POST",
		data: newCafe,
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

function sendNewPhoto(newPhoto, callback){
	$.ajax({
		url: "http://localhost:8000/api/v1.0/photo/",
		type: "POST",
		data: newPhoto,
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

function validateEmail(email) 
{
    var re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return re.test(email);
}

function openCafePage(id){
	var app = appState.getInstance();
	$.ajax({
		url: "http://localhost:8000/api/v1.0/cafe/"+id+'/',
		type: "GET",
		dataType : "json",
		success: function(json){
			console.log(json);
			app.changeData(app.getCafePage());
			showCafePhotoes(json.photoes);
			showCafeInfo(json.cafe, json.rating);		
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

function showCafePhotoes(photoes){
	if(!photoes || !photoes.length){
		$('#myCarousel').hide();
	}
	else {
		var car = $('#myCarousel');
		var inn = car.find('.carousel-inner');
		for(var i = 0; i < photoes.length; i++){
			inn.append($('<div class="item">' +
							'<img class="img-responsive img-rounded" src="' + photoes[i].url + '" alt="slide #' + i + '" id = "' + photoes[i]._id + '">' +
						'</div>'));
		}
		inn.find('.item').eq(0).addClass('active');
	}
}

function showCafeInfo(cafe, rating){
	$('#cafe-name').html(cafe.name);
	$('#cafe-rating').html(rating.value);
	$('#cafe-rating').css('background-color', rating.color);
	$('#cafe-description').html(cafe.description);
	
}