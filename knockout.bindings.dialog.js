// Taken from http://jsfiddle.net/WpnTU/76/ and http://jsfiddle.net/rniemeyer/SnPdE/

//custom binding to initialize a jQuery UI dialog
ko.bindingHandlers.dialog = {
    init: function (element, valueAccessor, allBindingsAccessor) {
		var options = ko.unwrap(valueAccessor()) || {};

        //do in a setTimeout, so the applyBindings doesn't bind twice from element being copied and moved to bottom
		setTimeout(function () {
		    options.close = function () {
		        var dialogVisible = allBindingsAccessor().dialogVisible;
		        if (ko.isWriteableObservable(dialogVisible)) {
		            dialogVisible(false);
		        }
		    };

		    $(element).dialog(options);
		}, 0);

		//handle disposal
		ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
			$(element).dialog("destroy");
		});
    },
    
    update: function (element, valueAccessor, allBindingsAccessor) {

        var shouldBeOpen = ko.unwrap(allBindingsAccessor().dialogVisible),
            $el = $(element),
            dialog = $el.data("uiDialog") || $el.data("dialog");

        //don't call open/close before initilization
        if (dialog) {
            var isOpen = $el.dialog("isOpen");
            if (shouldBeOpen && !isOpen) {
                $el.dialog("open");
            } else if (isOpen && !shouldBeOpen) {
                $el.dialog("close");
            }
        }
    }
};

//custom binding to initialize a jQuery UI button
ko.bindingHandlers.jqButton = {
	init: function (element, valueAccessor) {
		var options = ko.utils.unwrapObservable(valueAccessor()) || {};

		//handle disposal
		ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
			$(element).button("destroy");
		});

		$(element).button(options);
	}
};