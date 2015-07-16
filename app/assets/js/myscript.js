$(document).ready(function () {
	$('[data-toggle="offcanvas1"]').click(function () {
		$('.row-offcanvas').toggleClass('active1')
	});
	$('[data-toggle="offcanvas2"]').click(function () {
		$('.row-offcanvas').toggleClass('active2')
	});
	$('#sign-in').click(function () {
		$('#login-form').hide();
		$('#main-container').show();
	});
	$('#register').click(function(){
		$('#login-form').hide();
		$('#registration-form').show();
	});
	$('#registration').click(function(){
		$('#registration-form').hide();
		$('#main-container').show();
	});
});
var myMap;

function init(){     
    myMap = new ymaps.Map("map-container", {
        center: [53.901090 , 27.558759],
        zoom: 11
    });
}

ymaps.ready(init);