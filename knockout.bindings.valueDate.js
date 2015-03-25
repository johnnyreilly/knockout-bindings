ko.bindingHandlers.valueDate = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here

        var observable = valueAccessor(),
            properties = allBindingsAccessor();

        var interceptor = ko.computed({
            read: function () {
                var format = properties.dateFormat || "dd MMM yyyy",
                    value = ko.utils.unwrapObservable(observable); // value is a string (format "YYYY-MM-DD")

                return (value)
                    ? Globalize.format(moment(value).toDate(), format)
                    : "";
            },
            write: function (newValue) {
                var date = Globalize.parseDate(newValue);
                if (date instanceof Date) {
                    observable(moment(date).format(site.constants.Date_YearMonthDate));
                } else if ((newValue.length === 0) && (properties.isNullable)) {
                    // If newValue is a blank string and the isNullable property has been set then nullify the observable
                    observable(null);
                }
            }
        });

        if (element.tagName.toLowerCase() === 'input') {
            ko.applyBindingsToNode(element, { value: interceptor });
        } else {
            ko.applyBindingsToNode(element, { text: interceptor });
        }
    }
};
