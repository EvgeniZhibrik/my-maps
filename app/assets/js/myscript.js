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
});