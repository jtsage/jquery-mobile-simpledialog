jQuery-Mobile-SimpleDialog
==========================

SimpleDialog is a very simple popup (modal) or jQMdialog (page) Dialog widget.  For usage, see the source of the [demo](http://dev.jtsage.com/jQM-SimpleDialog/).


SimpleDialog Features
---------------------

* Two display modes, either a button choice (bool), or a text entry (string).

* Attempts to position itself centered over the input, however, for small screens, it will open a dialog window instead.

* Click outside the widget to close.

* Options can be configured via data-options attribute

Available Options
-----------------

_These can be passed to the dialog via an object set at the data-options attribute, or in the standard method_

### Themeing:
* __pickPageTheme__ : Theme for popup window or dialog
* __pickPageInputTheme__ : String Mode Input Element
* __pickPageButtonTheme__ : Widget buttons
* __zindex__ : Z-Index for popup window (default: 500)

### Customization:
* __mode__ : Mode of operation - either button (bool) or text input (string)
* __prompt__ : Prompt for dialog
* __buttons__ : Object for buttons { 'name' : function () { }, 'name2' : function () { } }
* __allowReopen__ : Allow widget to reopen, default is true.
* __useModal__ : Use modal styleing (fade out background), default: true
* __forceInput__ : Force the user to choose a button (popup mode), clicking outside will not close dialog, default: true
* __useDialogForceTrue__ : Boolean *Always* use Dialog Window, regardless of screen size
* __useDialogForceFalse__ : Boolean *Never* use Dialog Window, regardless of screen size

### Button Customization:
* __click__ : Function to perform on click
* __icon__ : Icon for button
* __theme__: Theme for button

_Note: forceInput + useModal is the rough equivalent to modal: true in ui.dialog_
