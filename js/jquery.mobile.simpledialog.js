/*
 * jQuery Mobile Framework : plugin to provide a simple popup (modal) or jQMdialog (page) Dialog widget.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notifcation.
 * 
 */
(function($, undefined ) {
  $.widget( "mobile.simpledialog", $.mobile.widget, {
	options: {
		pickPageTheme: 'b',
		pickPageInputTheme: 'e',
		pickPageButtonTheme: 'a',
		
		disabled: false,
		zindex: '500',
		
		prompt: 'Are you sure?', // or false.
		mode: 'bool', // or 'string'
		allowReopen: true,
		useModal: true,
		forceInput: true,
		isOpen: false,
		blankMode: false,
		fullHTML: null,
		
		useDialogForceTrue: false,
		useDialogForceFalse: false,
		useDialog: false,
		isInit: false,
		sawOnce: false,
		enterToTrigger: 0,
		escToTrigger: 1,
		butObj: [],
		debug: false
	},
	open: function() {
		if ( this.options.isOpen ) { return true; }
		
		var self = this,
			o = this.options,
			docWinWidth = $(document).width(),
			docWinHeightOffset = $(window).scrollTop(),
			docWinHeight = $(window).height(),
			pickWinHeight = self.pickerContent.outerHeight(),
			pickWinWidth = self.pickerContent.innerWidth(),
			
			pickWinTop = docWinHeightOffset + ( docWinHeight / 2 )- ( pickWinHeight / 2),
			pickWinLeft = ( docWinWidth / 2) - ( pickWinWidth / 2);
					
		if ( (pickWinHeight + pickWinTop) > $(document).height() ) {
			pickWinTop = $(document).height() - (pickWinHeight + 2);
		}
		if ( pickWinTop < 45 ) { pickWinTop = 45; }
		
		if ( o.prompt !== false ) {
			self.pickerHeader.html(o.prompt);
			self.pickPage.find('.ui-header').find('.ui-title').text(o.prompt);
		}
		self.pickerContent.find('.ui-btn-active').removeClass('ui-btn-active');
		
		if ( !o.disabled ) {
			if ( ( docWinWidth > 400 && !o.useDialogForceTrue ) || o.useDialogForceFalse ) {
				o.useDialog = false;
				if ( o.useModal ) {
					self.screen.fadeIn('slow');
				} else {
					self.screen.removeClass('ui-simpledialog-hidden');
				}
				self.pickerContent.addClass('ui-overlay-shadow').css('zIndex', self.options.zindex);
				self.pickerHeader.show();
				self.pickerContent.css({'position': 'absolute', 'top': pickWinTop, 'left': pickWinLeft}).addClass('ui-overlay-shadow in').removeClass('ui-simpledialog-hidden');
			} else {
				o.useDialog = true;
				self.pickPageContent.append(self.pickerContent);
				self.pickerHeader.hide();
				self.pickerContent.removeClass('ui-overlay-shadow ui-simpledialog-hidden').css({'top': 'auto', 'left': 'auto', 'marginLeft': 'auto', 'marginRight': 'auto'}).css('zIndex', self.options.zindex);
				$.mobile.changePage(self.pickPage, {'transition': 'pop'});
			}
			this.options.isOpen = true;
		}
	},
	close: function() {
		var self = this;

		if ( self.options.useDialog ) {
			$(self.pickPage).dialog('close');
			self.pickerContent.addClass('ui-simpledialog-hidden').removeAttr('style').css('zIndex', self.options.zindex);
			self.thisPage.append(self.pickerContent);
		} else {
			if ( self.options.useModal ) {
				self.screen.fadeOut('slow');
			} else {
				self.screen.addClass('ui-simpledialog-hidden');
			}
			self.pickerContent.addClass('ui-simpledialog-hidden').removeClass('in').removeAttr('style').css('zIndex', self.options.zindex);
		}
		self.caller.removeClass('ui-btn-active');
		self.options.isOpen = false;
	},
	_create: function(){
		var self = this,
			o = $.extend(this.options, this.element.data('options')),
			caller = this.element;
		
		if ( o.isInit &&  o.allowReopen ) { 
			self.open(); 
		} else { 
			var thisPage = $('.ui-page-active'),
				pickPage = $("<div data-role='dialog' class='ui-simpledialog-dialog' data-theme='" + o.pickPageTheme + "' >" +
							"<div data-role='header' data-backbtn='false' data-theme='a'>" +
								"<div class='ui-title'>"+o.prompt+"</div>" +
							"</div>"+
							"<div data-role='content'>"+
								((o.mode === 'blank')?
								  ("<div class='ui-simpledialog-container ui-overlay-shadow ui-corner-all ui-simpledialog-hidden pop ui-body-"+o.pickPageTheme+"'>"+o.fullHTML+"</div>")
								  :'') +
							"</div>"+
						"</div>")
						.appendTo( $.mobile.pageContainer )
						.page().css('minHeight', '0px').css('zIndex', o.zindex).addClass('pop'),
				pickPageContent = pickPage.find( ".ui-content" );
				
			pickPage.find( ".ui-header a").bind('vclick', function(e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				self.close();
				return false;
			});
			
			if ( o.prompt === false ) {
				pickPage.find('.ui-header').find('.ui-title').html("&nbsp;");
			}
			
			$.extend(self, {
				pickPage: pickPage,
				thisPage: thisPage,
				pickPageContent: pickPageContent,
				screen: screen,
				caller: caller
			});
			
			self._buildPage();
			self.options.isInit = true;
		}
	},
	_init: function() {
		if ( !this.options.sawOnce || this.options.allowReopen ) {
			this.options.sawOnce = true;
			this.open();
		}
	},
	_buildPage: function () {
		var self = this,
			o = self.options,
			pickerInput,
			pickerChoice,
			screen,
			pickerContent = $("<div>", { "class": 'ui-simpledialog-container ui-overlay-shadow ui-corner-all ui-simpledialog-hidden pop ui-body-'+o.pickPageTheme} ).css('zIndex', o.zindex),
			pickerHeader = $("<div class='ui-simpledialog-header'><h4></h4></div>").appendTo(pickerContent).find("h4");
			
		if ( o.mode !== 'blank' ) {
			if ( o.prompt !== false ) {
				pickerHeader.html(o.prompt);
			} else {
				pickerHeader.parent().html();
			}
			
			if ( o.mode === 'string' ) {
				pickerInput = $("<div class='ui-simpledialog-controls'><input class='ui-simpledialog-input ui-input-text ui-shadow-inset ui-corner-all ui-body-"+o.pickPageInputTheme+"' type='text' name='pickin' /></div>")
					.bind('keyup', function(event) {
						if ( event.keyCode === 13 && o.enterToTrigger !== false )  {
							o.butObj[o.enterToTrigger].trigger('vclick');
						}
						if ( event.keyCode === 27 && o.escToTrigger !== false )  {
							o.butObj[o.escToTrigger].trigger('vclick');
						}
					})
					.appendTo(pickerContent);
			}
			
			pickerChoice = $("<div>", { "class":'ui-simpledialog-controls' }).appendTo(pickerContent);
				
			$.each(o.buttons, function(name, props) {
				props = $.isFunction( props ) ?	{ click: props } : props;
				props = $.extend({
					text: name,
					theme: o.pickPageButtonTheme,
					icon: 'check',
					iconpos: 'left'
				}, props);
				o.butObj.push($("<a href='#'>"+name+"</a>")
					.appendTo(pickerChoice)
					.buttonMarkup({theme: props.theme, icon: props.icon, iconpos: props.iconpos, corners: true, shadow: true})
					.unbind("vclick").unbind("click")
					.bind("vclick", function() {
						if ( o.mode === 'string' ) { self.caller.attr('data-string', pickerInput.find('input').val()); }
						props.click.apply(self.element[0], arguments);
						self.close();
					})
				);
			});
		} else {
			pickerContent = self.pickPageContent.contents();
		}
		
		pickerContent.appendTo(self.thisPage);
		
		screen = $("<div>", {'class':'ui-simpledialog-screen ui-simpledialog-hidden'})
			.css({'z-index': o.zindex-1})
			.appendTo(self.thisPage)
			.bind("vclick", function(event){
				if ( !o.forceInput ) {
					self.close();
				}
				event.preventDefault();
			});
			
		if ( o.useModal ) { screen.addClass('ui-simpledialog-screen-modal'); }
			
		$.extend(self, {
			pickerContent: pickerContent,
			pickerHeader: pickerHeader,
			screen: screen
		});
	},
	disable: function(){
		this.options.disabled = true;
	},
	enable: function(){
		this.options.disabled = false;
	}
	
  });
	
	
})( jQuery );
