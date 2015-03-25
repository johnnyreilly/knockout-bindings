// Based on http://jsfiddle.net/rniemeyer/H4gpe/
ko.bindingHandlers.booleanValue = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var observable = valueAccessor(),
            interceptor = ko.computed({
                read: function () {
                    var val = observable();
                    return (val === null || val === undefined) ? null : val.toString();
                },
                write: function (newValue) {
                    var newVal = newValue.toLowerCase();
                    observable(newVal === "true" ? true : (newVal === "false" ? false : null));
                }
            });

        ko.applyBindingsToNode(element, { value: interceptor });
    }
};