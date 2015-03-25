// By: Hans Fjällemark and John Papa
// http://jsfiddle.net/rniemeyer/dtpfv/light/
//
// Knockout.dirtyFlag
// http://www.knockmeout.net/2011/05/creating-smart-dirty-flag-in-knockoutjs.html
//
// Ryan Niemeyer
//          http://www.knockmeout.net/
//          http://twitter.com/@rpniemeyer
//
// Depends on scripts:
//          Knockout 
//
////////////////////////////////////////////////////////////////////////////////////////
; (function (ko) {
    
    ko.dirtyFlag = function (root, isInitiallyDirty) {
        var result = function () { },
            _initialState = ko.observable(ko.toJSON(root)),
            _isInitiallyDirty = ko.observable(isInitiallyDirty);

        result.isDirty = ko.computed(function () {
            return _isInitiallyDirty() || _initialState() !== ko.toJSON(root);
        });

        result.reset = function () {
            _initialState(ko.toJSON(root));
            _isInitiallyDirty(false);
        };

        return result;
    };
})(ko);