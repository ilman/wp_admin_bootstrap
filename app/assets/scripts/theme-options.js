jQuery(document).ready(function($){

	var $sg_to_container = $('.sg-to-container');
	
	$('.sg-to-side a').on('click', function(){

		var $this = $(this);
		var $container = $this.closest('.sg-to-container');
		var active_tab = $this.attr('href');

		if(!active_tab){
			console.log('active_tab not set');
			return false;
		}

		//set cookie
		Cookies.set($container.attr('id')+'_tab', active_tab.replace('#',''));
		
		//set hash
		if(history.pushState) {
			window.history.pushState(null, null, active_tab);
		}
		else {
			window.location.hash = active_tab;
		}
	});

	// init
	$sg_to_container.each(function(){
		var $this = $(this);
		var $nav_a = $this.find('.sg-to-side a');
		var active_tab = Cookies.get($this.attr('id')+'_tab');

		if(typeof active_tab === 'undefined' || !active_tab){
			active_tab = $nav_a.first().attr('href').replace('#', '');
		}

		var $nav_active = $this.find('.sg-to-side').find('.tab-nav-'+active_tab);

		if($nav_active.length < 1){
			$nav_a.first().click();
		}
		else{
			$nav_active.find('a').click();
		}


	})

});