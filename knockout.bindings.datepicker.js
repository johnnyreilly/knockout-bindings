// Based on http://stackoverflow.com/a/6613255/2638225
ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var allBindings = allBindingsAccessor(),
            options = allBindings.datepickerOptions || {},
            $el = $(element);

        // Set name and id if not already set
        if (allBindings.attr) {
            $el.attr(allBindings.attr);
        }

        // Trigger a keyup event on the input element so it is revalidated by jQuery Validation 
        options.onClose = function(dateText, inst) {
            $(this).keyup();
        };

        $el.datepicker(options);

        //handle the field changing
        ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor();
            observable(moment($el.datepicker("getDate")).format(site.constants.Date_YearMonthDate));
        });

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $el.datepicker("destroy");
        });

    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()), // value is a string (format "YYYY-MM-DD")
            $el = $(element),
            currentDateInPicker = $el.datepicker("getDate");

        if (value) {
            var momentValue = moment(value);
            if (momentValue.toDate() - currentDateInPicker !== 0) {
                $el.datepicker("setDate", momentValue.format(site.constants.Date_DayMonthYear));
            }
        } else if (currentDateInPicker) {
            // Clear the picker
            $el.datepicker("setDate", null);
        }
    }
};