//do nothing for now.
$(":jqmData(role)=page").live('pageinit', function(e) {
	var currentPage = $(e.target),
		footerAll = $('<div data-role="footer">' +
			'<div data-role="controlgroup" data-type="horizontal">' +
				'<a data-role="button" data-theme="a" rel="external" href="https://github.com/jtsage/jquery-mobile-simpledialog">GitHub Source</a>' +
				'<a data-role="button" data-theme="a" rel="external" href="http://dev.jtsage.com/forums/">Support Forums</a>' +
				'<a data-role="button" data-theme="a" rel="external" href="http://dev.jtsage.com/blog/">Blog</a>' +
				'<a data-role="button" data-theme="a" rel="external" href="mailto:jtsage+datebox@gmail.com">Contact</a>' +
				'<a data-role="button" data-theme="a" rel="external" href="http://jquerymobile.com/">jQueryMobile Homepage</a>' +
			'</div></div>'),
		sidebarsource = 
			$('<li data-role="list-divider">Overview</li>' +
				'<li><a href="index.html">Introduction</a></li>' +
				'<li><a href="install.html">Download &amp; Use</a></li>' +
				'<li><a href="event.html">Methods, Events and Data</a></li>' +
				'<li><a href="options.html">Options Matrix</a></li>' +
				'<li><a href="buttonapi.html">Programming Buttons</a></li>' +
				'<li data-theme="a">Operation Modes</li>' +
				'<li><a href="button.html">Button / Input Mode</a></li>' +
				'<li><a href="blank.html">Blank (Freeform) Mode</a></li>' +
				'<li><a href="blankin.html">Blank Mode "Inlining"</a></li>' +
				'<li data-theme="a">Display Modes</li>' +
				'<li><a href="popup.html">Standard Pop-up</a></li>' +
				'<li><a href="dialog.html">jQM Dialog Page</a></li>' +
				'<li><a href="fullscreen.html">Fullscreen Display</a></li>' +
			''),
	sidebarstart = $('<ul data-corners="false" data-role="listview" data-inset="true" data-theme="c" data-dividertheme="f"></ul>');
	
	if ( currentPage.jqmData('role') === 'page' ) {
		var footer = currentPage.find('[data-role=footer]'),
			sidebar = currentPage.find('div.sidebar'),
			thisone = sidebarstart.clone();
			
		footer.html(footerAll.trigger('create'));
		currentPage.trigger('create');
		
		if ( sidebar.length > 0 ) {
			thisone.append(sidebarsource);
			sidebar.append(thisone);
			sidebar.find('ul').listview();
		}
	}
	
});

