 /*
 * jQuery Mobile Framework : plugin to provide a simple popup (modal) or jQMdialog (page) Dialog widget.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notifcation.
 * https://github.com/jtsage/jquery-mobile-simpledialog
 */
(function($, undefined ) {
  $.widget( "mobile.simpledialog", $.mobile.widget, {
	options: {
		version: '1.0.1-2012020100', // jQueryMobile-YrMoDaySerial
		pickPageTheme: 'b',
		pickPageInputTheme: 'e',
		pickPageButtonTheme: 'a',
		fullScreen: false,
		fullScreenAlways: false,

		disabled: false,
		zindex: '500',
		width:  '280px',

		prompt: 'Are you sure?', // or false.
		mode: 'bool', // or 'string'
		allowReopen: true,
		useModal: true,
		forceInput: true,
		isOpen: false,
		blankMode: false,
		fullHTML: null,
		subTitle: false,
		inputPassword: false,
		cleanOnClose: false,
		animate: true,
		transition: 'pop',
		clickEvent: 'click',

		left: undefined,
		top: undefined,

		useDialogForceTrue: false,
		useDialogForceFalse: false,
		useDialog: false,
		isInit: false,
		sawOnce: false,
		enterToTrigger: 0,
		escToTrigger: 1,
		butObj: [],
		debug: false,
		selects: false,
		selectparent: [],

		onCreated:null,
		onOpened:null,
		onClosed:null,
		onShown:null
	},
	_eventHandler: function(event, payload) {
		// Handle all event triggers that have an internal effect
		var widget = $(this).data('simpledialog'),
			o = widget.options;

		if ( ! event.isPropagationStopped() ) {
			switch (payload.method) {
				case 'close':
					widget.close(payload.fromCloseButton);
					break;
				case 'open':
					widget.open();
					break;
				case 'refresh':
					widget.refresh();
					break;
				case 'button':
					o.butObj[payload.index].trigger(o.clickEvent);
					break;
			}
		}
	},
	_orientChange: function(e) {
		var self = $(e.currentTarget).data('simpledialog'),
			o = self.options,
			docWinWidth = $.mobile.activePage.width(),
			docWinHeightOffset = $(window).scrollTop(),
			docWinHeight = $(window).height(),
			pickWinHeight = self.pickerContent.outerHeight(),
			pickWinWidth = self.pickerContent.innerWidth(),

			pickWinTop = (parseFloat(o.top)+10000) ? parseFloat(o.top) : (docWinHeightOffset + ( docWinHeight / 2 )- ( pickWinHeight / 2)),
			pickWinLeft = (parseFloat(o.left)+10000) ? parseFloat(o.left) : (( docWinWidth / 2) - ( pickWinWidth / 2));

		if ( (pickWinHeight + pickWinTop) > $(document).height() ) {
			pickWinTop = $(document).height() - (pickWinHeight + 2);
		}
		if ( pickWinTop < 45 ) { pickWinTop = 45; }

		e.stopPropagation();
		if ( ! self.pickerContent.is(':visible') || o.useDialog === true ) {
			return false;  // Not open, or in a dialog (let jQM do it)
		} else {
			self.pickerContent.css({'top': pickWinTop, 'left': pickWinLeft});
		}
	},
	open: function() {
		if ( this.pickPage.is(':visible') ) { return false; }

		var self = this,
			o = this.options,
			docWinWidth = $.mobile.activePage.width(),
			docWinHeightOffset = $(window).scrollTop(),
			docWinHeight = $(window).height(),
			pickWinHeight = self.pickerContent.outerHeight(),
			pickWinWidth = self.pickerContent.innerWidth(),
			fullTop = $(window).scrollTop(),
			fullLeft = $(window).scrollLeft(),

			pickWinTop = (parseFloat(o.top)+10000) ? parseFloat(o.top) : (docWinHeightOffset + ( docWinHeight / 2 )- ( pickWinHeight / 2)),
			pickWinLeft = (parseFloat(o.left)+10000) ? parseFloat(o.left) : (( docWinWidth / 2) - ( pickWinWidth / 2));

		if ( (pickWinHeight + pickWinTop) > $(document).height() ) {
			pickWinTop = $(document).height() - (pickWinHeight + 2);
		}
		if ( pickWinTop < 45 ) { pickWinTop = 45; }

		if ( o.prompt !== false ) {
			self.pickerHeader.html(o.prompt);
			self.pickPage.find('.ui-header').find('.ui-title').text(o.prompt);
		}
		self.pickerContent.find('.ui-btn-active').removeClass('ui-btn-active');

		if ( o.mode === 'blank' ) {
			self.pickerContent.delegate('[rel="close"]', o.clickEvent, function() {
				self.close();
			});
		}

		if ( !o.disabled ) {
			if ( ( docWinWidth > 400 && !o.useDialogForceTrue ) || o.useDialogForceFalse || o.fullScreen ) {
				o.useDialog = false;

				if ( o.fullScreen === false ) {
					if ( o.useModal === true ) {
						if ( o.animate === true ) { self.screen.fadeIn('slow'); }
						else { self.screen.show(); }
					} else {
						self.screen.removeClass('ui-simpledialog-hidden');
					}
				}

				if ( o.mode === 'blank' ) {
					o.selects = self.pickPage.find('.ui-selectmenu');

					o.selects.each(function () {
						o.selectparent.push($(this).closest('.ui-dialog'));
						$(this).appendTo(self.thisPage);
					});
				}

				self.pickerContent.addClass('ui-overlay-shadow').css('zIndex', self.options.zindex);

				self.pickerHeader.show();

				if ( o.fullScreenAlways || ( o.fullScreen && docWinWidth < 400 ) ) {
					self.pickerContent.css({'border': '0px !important', 'position': 'absolute', 'top': fullTop, 'left': fullLeft, 'height': docWinHeight, 'width': docWinWidth, 'maxWidth': docWinWidth }).addClass('ui-overlay-shadow in').removeClass('ui-simpledialog-hidden');
				} else {
					self.pickerContent.css({'position': 'absolute', 'top': pickWinTop, 'left': pickWinLeft}).addClass('ui-overlay-shadow in').removeClass('ui-simpledialog-hidden');
				}
			} else {
				// prevent the parent page from being removed from the DOM,
				self.thisPage.unbind( "pagehide.remove" );
				o.useDialog = true;
				self.pickPageContent.append(self.pickerContent);
				self.pickerHeader.hide();
				self.pickerContent.removeClass('ui-overlay-shadow ui-simpledialog-hidden').css({'top': 'auto', 'left': 'auto', 'marginLeft': 'auto', 'marginRight': 'auto'}).css('zIndex', self.options.zindex);
				$.mobile.changePage(self.pickPage, {'transition': (o.animate === true) ? o.transition : 'none' });
			}
			this.options.isOpen = true;
		}
	},
	close: function(fromCloseButton) {
		var self = this;
		fromCloseButton = ( typeof(fromCloseButton) === 'undefined' ) ? false : fromCloseButton;

		if ( self.options.useDialog ) {
			if ( fromCloseButton === false ) {
				$(self.pickPage).dialog('close');
			}
			if( (typeof self.thisPage.jqmData("page")) !== 'undefined' && ! self.thisPage.jqmData("page").options.domCache ){
				self.thisPage.bind( "pagehide.remove", function() {
					$(self).remove();
				});
			}
			self.pickerContent.addClass('ui-simpledialog-hidden');
			self.thisPage.append(self.pickerContent);
		} else {
			if ( self.options.useModal ) {
				if ( self.options.animate === true ) {
					self.screen.fadeOut('slow');
				} else {
					self.screen.hide();
				}
			} else {
				self.screen.addClass('ui-simpledialog-hidden');
			}
			self.pickerContent.addClass('ui-simpledialog-hidden').removeClass('in');
		}
		self.caller.removeClass('ui-btn-active');
		self.options.isOpen = false;
		if ( self.options.cleanOnClose === true && self.options.useDialog === false ) {
			self.clean();
		}
		if (self.options.onClosed && typeof(self.options.onClosed) === "function") {
			self.options.onClosed(self);
		}
	},
	clean: function() {
		// Clean self out of the DOM
		var self = this;

		if ( self.options.selects !== false ) {
			self.options.selects.each(function() {
				$(this).remove();
			});
			$(self.options.selectparent).each(function() {
				$(this).remove();
			});
		}
		self.pickerContent.remove();
		self.pickPage.remove();
		self.screen.remove();
		self.caller.removeData('simpledialog');
	},
	_create: function(){
		var self = this,
			o = $.extend(this.options, this.element.data('options')),
			caller = this.element;

		if ( o.isInit &&  o.allowReopen ) {
			self.open();
		} else {
			var thisPage = caller.closest('.ui-page'),
				pickPage = $("<div data-role='dialog' class='ui-simpledialog-dialog' data-theme='" + o.pickPageTheme + "' >" +
							"<div data-role='header' data-backbtn='false' data-theme='a'>" +
								"<div class='ui-title'>"+o.prompt+"</div>" +
							"</div>"+
							"<div data-role='content'></div>"+
						"</div>"),
				ct = null,
				pickPageContent = null;

			if (o.mode === 'blank') {
				ct = $("<div class='ui-simpledialog-container ui-overlay-shadow ui-corner-all ui-simpledialog-hidden "+((o.animate === true)?o.transition:'')+" ui-body-" +
					o.pickPageTheme + "'></div>");
				ct.html(o.fullHTML);
				$('[data-role=content]', pickPage).append(ct);
			}

			pickPage.appendTo( $.mobile.pageContainer )
				.page().css('minHeight', '0px').css('zIndex', o.zindex);

			if ( o.animate === true ) { pickPage.addClass('pop'); }

			pickPageContent = pickPage.find( ".ui-content" );

			// Bind the master handler.
			caller.live('simpledialog', self._eventHandler);

			// Bind the close button on the DIALOG mode.
			pickPage.find( ".ui-header a").bind(o.clickEvent, function(e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				self.close(true);
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

			$(document).bind('orientationchange', function(e) { caller.trigger('orientationchange'); });

			caller.bind('orientationchange', self._orientChange);

			if (self.options.onCreated && typeof(self.options.onCreated) === "function") {
				self.options.onCreated(self);
			}
		}
	},
	_reposition: function() {
		var self = this,
			o = this.options,
			docWinWidth = $.mobile.activePage.width(),
			docWinHeightOffset = $(window).scrollTop(),
			docWinHeight = $(window).height(),
			pickWinHeight = self.pickerContent.outerHeight(),
			pickWinWidth = self.pickerContent.innerWidth(),

			pickWinTop = (parseFloat(o.top)+10000) ? parseFloat(o.top) : (docWinHeightOffset + ( docWinHeight / 2 )- ( pickWinHeight / 2)),
			pickWinLeft = (parseFloat(o.left)+10000) ? parseFloat(o.left) : (( docWinWidth / 2) - ( pickWinWidth / 2));

		if ( (pickWinHeight + pickWinTop) > $(document).height() ) {
			pickWinTop = $(document).height() - (pickWinHeight + 2);
		}
		if ( pickWinTop < 45 ) { pickWinTop = 45; }

		self.pickerContent.css({'position': 'absolute', 'width': pickWinWidth, 'top': pickWinTop, 'left': pickWinLeft});
	},
	refresh: function() {
		if ( this.options.mode !== "blank" ) {
			return false;
		} else {
			this.pickerContent.css('width', 'auto');
			this.pickerContent.html(this.options.fullHTML);
			this.pickerContent.trigger('create');

			if ( this.pickerContent.is(':visible') && this.options.useDialog === false ) {
				this._reposition();
			}
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
			idx = null,
			pickerInput,
			pickerChoice,
			screen,
			pickerContent = $("<div>", { "class": 'ui-simpledialog-container ui-overlay-shadow ui-corner-all ui-simpledialog-hidden '+((o.animate===true)?o.transition:'')+' ui-body-'+o.pickPageTheme}).css({'zIndex': o.zindex, 'width': o.width}),
			pickerHeader = $("<div class='ui-simpledialog-header'><h4></h4></div>").appendTo(pickerContent).find("h4");

		pickerContent.bind('webkitAnimationEnd', function(){
			if (self.options.onShown && typeof(self.options.onShown) === "function") {
				self.options.onShown(self);
			}
		});

		if ( o.mode !== 'blank' ) {
			if ( o.prompt !== false ) {
				pickerHeader.html(o.prompt);
			} else {
				pickerHeader.parent().html();
			}

			if ( o.subTitle !== false ) {
				$("<p class='ui-simpledialog-subtitle'>"+o.subTitle+"<p>").appendTo(pickerContent);
			}

			if ( o.mode === 'string' ) {
				pickerInput = $("<div class='ui-simpledialog-controls'><input class='ui-simpledialog-input ui-input-text ui-shadow-inset ui-corner-all ui-body-"+o.pickPageInputTheme+"' type='"+((o.inputPassword===true)?"password":"text")+"' name='pickin' /></div>")
					.bind('keyup', function(event) {
						if ( event.keyCode === 13 && o.enterToTrigger !== false )  {
							o.butObj[o.enterToTrigger].trigger(o.clickEvent);
						}
						if ( event.keyCode === 27 && o.escToTrigger !== false )  {
							o.butObj[o.escToTrigger].trigger(o.clickEvent);
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
					iconpos: 'left',
					closeOnClick: true
				}, props);
				idx = o.butObj.push($("<a href='#'>"+name+"</a>")
					.appendTo(pickerChoice)
					.buttonMarkup({theme: props.theme, icon: props.icon, iconpos: props.iconpos, corners: true, shadow: true})
					.unbind("vclick").unbind("click")
					.bind(o.clickEvent, function() {
						if ( o.mode === 'string' ) { self.caller.attr('data-string', pickerInput.find('input').val()); }
						var val = props.click.apply(self.element[0], arguments);
						if ( val !== false && props.closeOnClick === true ) {
							self.close();
						}
					})
				);

				if(typeof(props.id) !== 'undefined' && props.id.length > 0) o.butObj[idx-1].attr('id', props.id);
				if(props.hidden) o.butObj[idx-1].addClass('button-hidden');

				if(props.insertSeparator)
					$("<div class='buttons-separator'>").appendTo(pickerChoice);
			});
		} else {
			pickerContent = self.pickPageContent.contents();
		}

		pickerContent.appendTo(self.thisPage);

		screen = $("<div>", {'class':'ui-simpledialog-screen ui-simpledialog-hidden'})
			.css({'z-index': o.zindex-1})
			.appendTo(self.thisPage)
			.bind(o.clickEvent, function(event){
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
