
// Based on http://jsfiddle.net/rniemeyer/PCmma/
ko.bindingHandlers.changedCss = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var original, dirty, data, cssClass, binding,
            observable = valueAccessor(),
            properties = allBindingsAccessor();

        // The binding used to get / set values on your view model should be used here
        // Use value if present, fall back to valueNumber or checked if available
        // ONLY 1 OF THESE SHOULD BE IN USE
        data = properties.value || properties.valueNumber || properties.checked;
        original = ko.utils.unwrapObservable(data);
        dirty = ko.computed({
            read: function () {
                return ko.utils.unwrapObservable(data) !== original;
            },
            disposeWhenNodeIsRemoved: element
        });

        cssClass = ko.utils.unwrapObservable(observable);
        binding = { css: {} };
        binding.css[cssClass] = dirty;

        ko.applyBindingsToNode(element, binding);
    }
};