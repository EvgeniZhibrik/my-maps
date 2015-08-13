function activateOffcanvas(cont) {
	cont.find('[data-toggle="offcanvas1"]').click(function () {
		cont.find('.row-offcanvas').toggleClass('active1');
	});
	cont.find('[data-toggle="offcanvas2"]').click(function () {
		cont.find('.row-offcanvas').toggleClass('active2');
	});	
}