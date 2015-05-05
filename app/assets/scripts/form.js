var $window = jQuery(window);
var wpsg = {};

var babi;

wpsg.init = function() {

	/*----bootstrap starter----*/

	$('.bs-tooltip').tooltip();
	$('.bs-popover').popover();
	$('.cs-modal').on('click', '.close', function(event) {
		var $this = $(this);
		$this.closest('.modal').hide();
	});

	/*---plugin enabler---*/
	(function() {
		if (typeof $.fn.datetimepicker === 'undefined') {
			return false;
		}
		$('.input-date').datetimepicker({
			pickTime: false,
			format: 'YYYY/MM/DD'
		});
	})();

	(function() {
		if (typeof $.fn.sortable === 'undefined') {
			return false;
		}
		$(".list-sortable").sortable().disableSelection();
	})();

	(function() {
		if (typeof $.fn.select2 === 'undefined') {
			return false;
		}

		$('.input-select2').each(function(){
			var $each = $(this);
			var data = {};
			var config = {};

			data = {
				placeholder: $each.attr('placeholder'),
  				allowClear: $each.data('allow-clear'),
  				templateResult: $each.data('template-result'), // function name
  				data: $each.data('data'), // var_name
  				maximumSelectionLength: $each.data('max-select'),
  				minimumResultsForSearch: $each.data('min-search-result'),
  				minimumInputLength: $each.data('min-input'),
			}

			if(typeof data.data !== 'undefined'){
				data.data = window[data.data];
			}

			config = {
  				allowClear: true,
			}

			$.each(data, function(key, val){
				if(typeof val !== 'undefined'){
					config[key] = val;
				}
			});

			$each.select2(config);
		})

		$('.input-select2-tags').each(function(idx) {
			var $this = $(this);
			var min_length = $this.data('min_length');
			var max_item = $this.data('max_item');

			var config = {
				tags: [],
				tokenSeparators: [',']
			};

			if (typeof min_length === 'undefined') {
				min_length = 3;
			}
			config.minimumInputLength = parseInt(min_length);

			if (typeof max_item !== 'undefined') {
				config.maximumSelectionSize = parseInt(max_item);
			}

			$this.select2(config);
		});


		$('.input-select2-post-add').each(function(idx) {
			var $this = $(this);
			var min_length = $this.data('min_length');
			var max_item = $this.data('max_item');
			var ajax_url = $this.data('ajax_url');
			var ajax_data = $this.data('ajax_data');
			var term_prefix = $this.data('term_prefix');
			var term_suffix = $this.data('term_suffix');

			if (typeof ajax_data !== 'undefined') {
				ajax_data = window[ajax_data];
			}

			if (typeof min_length === 'undefined') {
				min_length = 3;
			}

			if (typeof term_prefix === 'undefined') {
				term_prefix = '';
			}

			if (typeof term_suffix === 'undefined') {
				term_suffix = '';
			}

			var config = {
				minimumInputLength: parseInt(min_length),
				createSearchChoice: function(term) {
					return {
						id: term,
						text: term
					};
				},
				ajax: {
					type: 'POST',
					dataType: 'json',
					url: ajax_url,
					data: function(term, page) {
						ajax_data.val = term_prefix + term + term_suffix;
						return ajax_data;
					},
					results: function(response, page, query) {
						return {
							results: response
						};
					}
				},
				formatResult: function(response) {
					return response.label;
				},
				formatSelection: function(response) {
					if (typeof response.label !== 'undefined') {
						return response.label;
					} else {
						return response.text;
					}
				},
				initSelection: function(element, callback) {
					var value = $(element).val();

					callback({
						id: value,
						text: value
					});
				},
				id: function(response) {
					return response.label;
				}
			};

			if (typeof max_item !== 'undefined') {
				config.maximumSelectionSize = parseInt(max_item);
			}

			$this.select2(config);
		});
	})();


	(function() {
		if (typeof $.fn.spectrum === 'undefined') {
			return false;
		}

		$(".input-color-picker").each(function(idx){
			var $each = $(this);
			var $color_input = $each.find('.color-picker-input');
			var $color_btn = $each.find('.color-picker-btn');

			var data = {};
			var config = {};

			data = {
				color: $each.data('color'), //tinycolor,
				flat: $each.data('flat'),
				showInput: $each.data('show-input'),
				showInitial: $each.data('show-initial'),
				allowEmpty: $each.data('allow-empty'),
				showAlpha: $each.data('show-alpha'),
				disabled: $each.data('disabled'),
				localStorageKey: $each.data('storage-key'),
				showPalette: $each.data('show-pallete'),
				showPaletteOnly: $each.data('show-pallete-only'),
				togglePaletteOnly: $each.data('toggle-pallete-only'),
				showSelectionPalette: $each.data('show-selection-pallete'),
				clickoutFiresChange: $each.data('click-fire'),
				cancelText: $each.data('cancel-text'),
				chooseText: $each.data('choose-text'),
				togglePaletteMoreText: $each.data('pallete-more-text'),
				togglePaletteLessText: $each.data('pallete-less-text'),
				containerClassName: $each.data('container-class'),
				replacerClassName: $each.data('replacer-class'),
				preferredFormat: $each.data('preferred-format'),
				maxSelectionSize: $each.data('max-selection'),
				palette: $each.data('pallete'), //[[string]],
				selectionPalette: $each.data('selection-pallete') //[string]
			};

			config = {
				allowEmpty: true,
				showAlpha: true,
				showInput: false,
				showPalette: true,
				preferredFormat: 'text',
				palette: ['red', 'green', 'blue'],
				showButtons: false
			};

			$.each(data, function(key, val){
				if(typeof val !== 'undefined'){
					config[key] = val;
				}
			});

			$color_btn.spectrum(config)
			.on('move.spectrum', function(event, color){
				$color_input.val(color.toHexString());		
			});
		});
	})();

	(function(){
		if (typeof $.fn.slider === 'undefined') {
			return false;
		}

		$(".input-slider").each(function(idx){
			var $each = $(this);
			var $slider_ui = $each.find('.slider-ui');
			var $slider_value = $each.find('.slider-value');
			
			var config = {};
			var data = {};

			data = {
				range: $slider_ui.data('range'),
				min: $slider_ui.data('min'),
				max: $slider_ui.data('max')
			};

			if(data.range === 'range'){
				data.range = true;
			}

			if($slider_value.length > 1){
				var values = [];

				$.each($slider_value, function(sidx){
					var $this = $(this);
					values.push($this.val());
				});

				data.values = values;
			}
			else{
				data.value = $slider_value.val();
			}

			config = {
		      range: 'min',
		      min: 0,
		      max: 100,
		      slide: function(event, ui) {
		      	// $slider_value = $(ui.handle).closest('.input-slider').find('.slider-value');
		      	if($slider_value.length > 1){
			      	$slider_value.eq(0).val(ui.values[0]);
			      	$slider_value.eq(1).val(ui.values[1]);
		      	}
		      	else{
			      	$slider_value.val(ui.value);
			      }
		      }
		    };

			$.each(data, function(key, val){
				if(typeof val !== 'undefined'){
					config[key] = val;
				}
			});
			
			$slider_ui.slider(config);
		});

	})();

	(function(){
		if (typeof $.fn.TouchSpin === 'undefined') {
			return false;
		}

		$(".input-spinner").each(function(){
			var $each = $(this);

			var data = {};
			var config = {};

			data = {
				min: $each.data('min'),
				max: $each.data('max'),
				step: $each.data('step'),
				decimals: $each.data('decimals'),
				boostat: $each.data('boostat'),
				maxboostedstep: $each.data('maxboostedstep'),
				prefix: $each.data('prefix'),
				postfix: $each.data('postfix'),
			};

			config = {
				min: 0,
				max: 10,
				step: 2,
				decimals: 0,
				buttondown_class: 'sgtb-btn sgtb-btn-default',
				buttonup_class: 'sgtb-btn sgtb-btn-default'
			};

			$.each(data, function(key, val){
				if(typeof val !== 'undefined'){
					config[key] = val;
				}
			});

			$each.TouchSpin(config);
		});
	})();


	(function(){
		if (typeof $.fn.iconpicker === 'undefined') {
			return false;
		}
		$(".input-icon-picker").each(function(){
			var $each = $(this);
			var $icon_input = $each.find('.icon-picker-input');
			var $icon_picker = $each.find('.icon-picker-btn');

			var data = {};
			var config = {};

			config = {
				arrowClass: 'btn-danger',
				arrowPrevIconClass: 'fa fa-chevron-left',
				arrowNextIconClass: 'fa fa-chevron-right',
				cols: 5,
				icon: 'fa-heart',
				iconset: 'fontawesome',   
				labelHeader: '{0} of {1} pages',
				labelFooter: '{0} - {1} of {2} icons',
				placement: 'right',
				rows: 5,
				search: true,
				searchText: 'Search',
				selectedClass: 'btn-success',
				unselectedClass: ''
			};

			$.each(data, function(key, val){
				if(typeof val !== 'undefined'){
					config[key] = val;
				}
			});

			$icon_picker.iconpicker(config)
			.on('change', function(e) { 
				$icon_input.val(e.icon);
			});
		});
	})();
};

jQuery(document).ready(wpsg.init);