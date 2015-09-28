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

function validateInputForm(th){
	if($(th).attr('id') == 'input-email') {
		if(validateEmail($(th).val()))
			$(th).parents('.has-feedback').removeClass('has-error').addClass('has-success');
		else if(!($(th).val()) || $(th).val() === "")
			$(th).parents('.has-feedback').removeClass('has-error').removeClass('has-success');
		else
			$(th).parents('.has-feedback').addClass('has-error').removeClass('has-success');
	}
	else if ($(th).attr('id') == 'input-password') {
		if(!($(th).val()) || $(th).val() === "")
			$(th).parents('.has-feedback').removeClass('has-success');
		else
			$(th).parents('.has-feedback').addClass('has-success');
	}
	if($('.has-success').length == 2)
			$('#sign-in').removeAttr('disabled');
		else
			$('#sign-in').attr('disabled', 'disabled');
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
		url: 'http://localhost:8000/api/v1.0/'+app.getUser()._id+'/cafe/'+id+'/',
		type: "GET",
		dataType : "json",
		success: function(json){
			console.log(json);
			app.changeData(app.getCafePage().clone(true));
			showCafeInfo(json.cafe, json.rating, json.subscribed, json.yourRating);
			getPhotoes(json.cafe._id, showCafePhotoes);
			getComments(json.cafe._id, addCafeComments);		
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

function getPhotoes(id, callback){
	$.ajax({
		url: 'http://localhost:8000/api/v1.0/cafe/'+id+'/photo/',
		type: "GET",
		dataType : "json",
		success: function(json){
			console.log(json);
			callback && callback(id, json);		
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

function getComments(id, callback){
	$.ajax({
		url: 'http://localhost:8000/api/v1.0/cafe/'+id+'/comment/',
		type: "GET",
		dataType : "json",
		success: function(json){
			console.log(json);
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

function showCafePhotoes(id, photoes){
	var app = appState.getInstance();
	if(!photoes || !photoes.length){
		$('#myCarousel').hide();
	}
	else {
		var car = $('#myCarousel');
		var inn = car.find('.carousel-inner');
		for(var i = 0; i < photoes.length; i++){
			if(inn.find('#'+photoes[i]._id).length == 0)
				inn.append($('<div class="item">' +
								'<img class="img-responsive img-rounded" src="' + photoes[i].url + '" alt="slide #' + i + '" id = "' + photoes[i]._id + '">' +
							'</div>'));
		}
		if(inn.find('.item.active').length == 0)
			inn.find('.item').eq(0).addClass('active');
	}
	/*if(app.getCurrentPage() === app.getMainContainer() && app.getCurrentData() === app.getCafePage())
		getPhotoes(id, showCafePhotoes);*/
}

function addCafeComments(comments){
	var app = appState.getInstance();
	var com = $('#comments');
	/*comments.sort(function (a,b){
		return ((new Date(a.comment.date)) - (new Date(b.comment.date)));
	});*/
	for(var i = 0; i < comments.length; i++) {
		if(com.find('.comment').length > 0)
			com.find('.comment').eq(0).before(app.getComment().clone(true));
		else
			com.append(app.getComment().clone(true));
		var newComment = com.find('.comment').eq(0);
		newComment.attr('comment-id', comments[i].comment._id);
		newComment.find('.foto-mark').append($('<div class="row"></div><div class="row"><div class="comment-mark">' + comments[i].mark.mark + '</div></div>'));
		newComment.find('.foto-mark .row').eq(0).append($.cloudinary.image(comments[i].user.avatar, {width: 300, height: 480, crop: 'fit'}));
		newComment.find('img').addClass('img-responsive').addClass('img-rounded');
		newComment.find('.user').html(comments[i].user.firstName + ' ' + comments[i].user.lastName);
		newComment.find('.date').html(comments[i].comment.date);
		newComment.find('.text').html(comments[i].comment.text);
	}
}

function showCafeInfo(cafe, rating, subscribed, yourRating){
	$('#cafe-name').html(cafe.name);
	if(rating.value >= 0)
		$('#cafe-rating').html(rating.value);
	else
		$('#cafe-rating').html('NO');
	$('#cafe-rating').css('background-color', rating.color);
	if(yourRating.value >= 0)
		$('#your-rating').show().html(yourRating.value);
	else
		$('#your-rating').hide();
	$('#your-rating').css('background-color', yourRating.color);
	$('#cafe-description').html(cafe.description);
	if(subscribed){
		$('#cafe-add-places').hide();
		$('#cafe-remove-places').show();
	}
	else {
		$('#cafe-add-places').show();
		$('#cafe-remove-places').hide();
	}
	$('#cafe-add-places').attr('cafe-id', cafe._id);
	$('#cafe-remove-places').attr('cafe-id', cafe._id);
	$('#send-cafe-comment-button').attr('cafe-id', cafe._id);
}

function sendComment(id){
	var app = appState.getInstance();
	var x = $('#input-mark').val();
	if(x && x >= 0 && x <= 10 && x == Math.round(x)) {
		var newMark = {
			userID: app.getUser()._id,
			mark: parseInt(x)
		};
		$.ajax({
			url: 'http://localhost:8000/api/v1.0/cafe/'+ id + '/mark/overall/',
			type: "POST",
			data: newMark,
			dataType: 'json',
			success: function(json){
				console.log(json);
				if(($('#input-comment').val()) && ($('#input-comment').val() != '')) {
					var newObj = {
						userID: app.getUser()._id,
						cafeID: id,
						text: $('#input-comment').val(),
						date: new Date()
					};
					$.ajax({
						url: 'http://localhost:8000/api/v1.0/cafe/'+id+'/comment/',
						type: "POST",
						data: newObj,
						dataType : "json",
						success: function(json){
							console.log(json);
							openCafePage(id)
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
}