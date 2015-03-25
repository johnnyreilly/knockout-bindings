// Based on http://stackoverflow.com/a/12647270/761388
ko.bindingHandlers.valueNumber = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var observable = valueAccessor(),
            properties = allBindingsAccessor(),
            numberFormat = properties.numberFormat || "n2", // "n2" is default format if none specified
            decimalPlaces = parseFloat(numberFormat.substring(1), 10),
            storeFullValue = properties.storeFullValue || false, // By default we will round to the specified no of decimal places
            elementHasFocus = ko.observable(elementIsFocused()),
            handleElementFocusIn = handleElementFocusChange.bind(null, true),
            handleElementFocusOut = handleElementFocusChange.bind(null, false);

        var interceptor = ko.computed({
            read: function () {
                var currentValue = ko.unwrap(observable);
                if (elementHasFocus()) {
                    // Display the full underlying value (no truncation of decimal places)
                    return (!isNaN(currentValue) && (currentValue !== null) && (currentValue !== undefined))
                        ? currentValue.toString().replace(".", Globalize.findClosestCulture().numberFormat["."]) // Displays locale specific decimal separator (so de-DE would format 1.234 as "1,234")
                        : null;
                } else {
                    // Display the value formatted for the current locale
                    return Globalize.format(currentValue, numberFormat);
                }
            },
            write: function (newValue) {

                // Only in place to cater for bug in IE 9
                if (!ko.isWriteableObservable(observable)) {
                    return;
                }

                var newNumberValue = Globalize.parseFloat(newValue);
                
                if (!isNaN(newNumberValue)) {

                    if ((!storeFullValue) && (!isNaN(decimalPlaces))) {
                        // If decimal places has been specified in the formatter then only store value to that dp value
                        newNumberValue = parseFloat(newNumberValue.toFixed(decimalPlaces));
                    }

                    observable(newNumberValue);
                } else if (newValue.length === 0) {
                    if (properties.isNullable) {
                        // If newValue is a blank string and the isNullable property has been set then nullify the observable
                        observable(null);
                    } else {
                        // If newValue is a blank string and the isNullable property has not been set then set the observable to 0
                        observable(0);
                    }
                }
            }
        }).extend({ notify: 'always' });
        
        ko.utils.registerEventHandler(element, "focus", handleElementFocusIn);
        ko.utils.registerEventHandler(element, "focusin", handleElementFocusIn); // For IE
        ko.utils.registerEventHandler(element, "blur", handleElementFocusOut);
        ko.utils.registerEventHandler(element, "focusout", handleElementFocusOut); // For IE

        if (element.tagName.toLowerCase() === 'input') {
            ko.applyBindingsToNode(element, { value: interceptor });
        } else {
            ko.applyBindingsToNode(element, { text: interceptor });
        }


        /**
         * Adapted from the KO hasfocus handleElementFocusChange function
         */
        function elementIsFocused() {
            var isFocused = false,
                ownerDoc = element.ownerDocument;
            if ("activeElement" in ownerDoc) {
                var active;
                try {
                    active = ownerDoc.activeElement;
                } catch (e) {
                    // IE9 throws if you access activeElement during page load
                    active = ownerDoc.body;
                }
                isFocused = (active === element);
            }

            return isFocused;
        }

        /**
         * Adapted from the KO hasfocus handleElementFocusChange function
         *
         * @param {boolean} isFocused whether the current element has focus
         */
        function handleElementFocusChange(isFocused) {
            elementHasFocus(isFocused);
        }
    }
};
