jQuery-Mobile-SimpleDialog
==========================

SimpleDialog is a very simple popup (modal) or jQMdialog (page) Dialog widget.  For usage, see the source of the [demo](http://dev.jtsage.com/jQM-SimpleDialog/).


SimpleDialog Features
---------------------

* Two display modes, either a button choice (bool), or a text entry (string).

* Attempts to position itself centered over the input, however, for small screens, it will open a dialog window instead.

* Click outside the widget to close.

* Options can be configured via data-options attribute

Suggested Use
-------------
The use of SimpleDialog is just that, very simple.  Assuming a trigger of a usual button, i.e.:

	<a href='#' id='diag1' data-role='button'>Simple Dialog, String Style</a>
	
A typical SimpleDialog code block would look like:

	$('#diag1').live('click', function() {
		$(this).simpledialog({
			'mode' : 'string',
			'prompt' : 'Type Something!',
			'buttons' : {
				'Done, Submit': {
					click: function () { 
						alert('You Wrote: ' + $('#diag1').attr('data-string'));
					}
				},
				'Cancel': {
					click: function () { return true; },
					icon: "delete",
					theme: "c"
				}
			}
		})
	});

#### Global Option Overrides:
	
	// AFTER loading jQM
	jQuery.extend(jQuery.mobile.simpledialog.prototype.options, {
		'useDialogForceTrue': true
	});
	
Available Options
-----------------

These can be passed to the dialog via an object set at the data-options attribute, or in the standard method

* __option__ : Description _(default value)_

### Themeing:
* __pickPageTheme__ : Theme for popup window or dialog. _(b)_
* __pickPageInputTheme__ : String Mode Input Element. _(e)_
* __pickPageButtonTheme__ : Widget buttons. _(a)_
* __zindex__ : Z-Index for popup window. _(500)_

### Customization:
* __mode__ : Mode of operation - either 'bool' Choice buttons, or 'string' input. _(bool)_
* __prompt__ : Prompt for dialog, or false to suppress display. _(Are you sure?)_
* __buttons__ : Object for buttons. _(null)_
* __allowReopen__ : Allow widget to reopen. _(true)_
* __useModal__ : Use modal styling - fade out background. _(true)_
* __forceInput__ : Force the user to choose a button in popup mode. _(true)_
* __useDialogForceTrue__ : Boolean *Always* use Dialog Window, regardless of screen size. _(false)_
* __useDialogForceFalse__ : Boolean *Never* use Dialog Window, regardless of screen size. _(false)_
* __enterToTrigger__ : Index of the button to trigger on ENTER [string mode]. _(0)_
* __escToTrigger__ : Index of the button to trigger on ESC [string mode]. _(1)_

### Button Customization:
* __click__ : Function to perform on click
* __icon__ : Icon for button
* __theme__ : Theme for button

### Runtime Fun:
* __butObj__ : contains the button objects.  e.g. butObj[0].trigger('click') might be fun.
* __sawOnce__ : on a forceInput dialog, set to false to allow it to open again.

_Note: forceInput + useModal is the rough equivalent to modal: true in ui.dialog_
