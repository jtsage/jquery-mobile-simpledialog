
<!DOCTYPE html> 
<html lang="en"> 
<head> 
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" /> 
	<title>jQueryMobile - SimpleDialog Demo</title>
	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a4.1/jquery.mobile-1.0a4.1.min.css" />
	<link type="text/css" href="http://dev.jtsage.com/cdn/simpledialog/latest/jquery.mobile.simpledialog.css" rel="stylesheet" /> 
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script> 
	<script type="text/javascript" src="http://code.jquery.com/mobile/1.0a4.1/jquery.mobile-1.0a4.1.min.js"></script>
	<script type="text/javascript" src="http://dev.jtsage.com/cdn/simpledialog/latest/jquery.mobile.simpledialog.js"></script>
	
</head>
<body>
<div data-role="page" data-theme="a" id="main"> 
	<div data-role="header"> 
		<h1>jQueryMobile - SimpleDialog Demo (1.0a4.1 Base)</h1>
	</div>
	<div data-role="content" data-theme="c">
		<script type="text/javascript">
			$('#diag1').live('click', function() {
				$(this).simpledialog({
					'mode' : 'bool',
					'prompt' : 'Pick One!',
					'buttons' : {
						'Yes': {
							click: function () { 
								$('#diag1').find('.ui-btn-text').text(
									$('#diag1').find('.ui-btn-text').text() + ' -- YES!'
								);
							}
						},
						'No': {
							click: function () { 
								$('#diag1').find('.ui-btn-text').text(
									$('#diag1').find('.ui-btn-text').text() + ' -- NO!'
								);
							},
							icon: "delete",
							theme: "c"
						}
					}
				})
			});
			
			$('#diag2').live('click', function() {
				$(this).simpledialog({
					'mode' : 'string',
					'prompt' : 'What is your name?',
					'buttons' : {
						'OK': {
							click: function () { 
								$('#diag2').find('.ui-btn-text').text(
									$('#diag2').find('.ui-btn-text').text() + 
									' -- ' + 
									$('#diag2').attr('data-string')
								);
							}
						},
						'Cancel': {
							click: function () { console.log(this); },
							icon: "delete",
							theme: "c"
						}
					}
				})
			});
			
			$('#diag3').live('click', function() {
				$(this).simpledialog({
					'mode' : 'bool',
					'prompt': false,
					'allowReopen': false,
					'buttons' : {
						'Yes': {
							click: function () {
								$('#diag3').find('.ui-btn-text').text(
									$('#diag3').find('.ui-btn-text').text() + ' -- YES!'
								);
							}
						},
						'No': {
							click: function () {
								$('#diag3').find('.ui-btn-text').text(
									$('#diag3').find('.ui-btn-text').text()+' -- NO!'
								); },
							icon: "delete"
						}
					}
				})
			});
			
			//This is how the form works:
			
			$('select').live('change', function(e) { // BEGIN : Add Dropdown Option
				var self = this;
		
				$(self+':selected:not([data-placeholder])').each(function(){
					if ( $(this).attr('data-addoption') ) {
						$(self).simpledialog({
							'mode' : 'string',
							'prompt' : 'Add New Option',
							'useDialogForceFalse' : true,
							'buttons' : {
								'Yes, Add' : {
									click: function () { 
										thisopt = $(self).attr('data-string');
										$('<option value="'+thisopt+'" selected="selected">'+thisopt+'</option>').appendTo($(self));
										$(self).selectmenu('refresh', true);
										return true; }
								},
								'Cancel' : {
									click: function () { $(self).selectmenu('open'); },
									icon: "delete"
								}
							}
						});
					}
				});
			}); // END : Add Dropdown Option
			
		</script>
		<a href='#' id='diag1' data-role='button'>Boolean Dialog</a>	
		<a href='#' id='diag2' data-role='button'>String Dialog</a>	
		<a href='#' id='diag3' data-role='button'>One-Shot Boolean Dialog, No Prompt Text</a>
		<br />
		Why I wrote the string method...
		<form method='get' action='post'>
		<div data-role='fieldcontain'><label for='vendor'>Some Select Menu, using jQM styles</label><select data-native-menu="false" name='vendor' id='vendor' ><option data-placeholder='true'>Choose one...</option><option data-addoption='true' value='0'>Add New...</option><option value='Example Vendor'>Example Vendor</option><option value='Another Example Vendor'>Another Example Vendor</option></select></div> 
		</form>
		<div>
		<?php
		include_once "../markdown.php";
		$md_text = file_get_contents("README.md");
		echo Markdown($md_text);
		?>
		</div>
	</div>
	<div data-role="footer">
		<a href="https://github.com/jtsage/jquery-mobile-simpledialog">GitHub Source</a><a href="mailto:jtsage+simpledialog@gmail.com">Contact</a>
	</div>
</div>
</html>
