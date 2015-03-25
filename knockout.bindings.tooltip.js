// Based on http://stackoverflow.com/a/16876013/761388
// Example usage: 
// data-bind="tooltip: { title: UserMessage }"
// data-bind="tooltip: { title: UserMessage, position: { my: 'left top', at: 'right-20 top' } }"
ko.bindingHandlers.tooltip = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = ko.utils.unwrapObservable(valueAccessor());

        if (options.title) {

            var title = options.title;
            delete options.title;
            $(element)
                .attr("title", title)
                .tooltip(options);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).tooltip("destroy");
            });
        }
    }
};
