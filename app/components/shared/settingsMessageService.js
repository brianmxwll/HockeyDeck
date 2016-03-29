//Simple service to facilitate messaging between various components in the system. 

angular
    .module('hockeydeck')
    .factory('settingsMessageService', function($rootScope) {
        return {
            subscribe: function(event, scope, callback) {
                var handler = $rootScope.$on(event, function(e, args) {
                    callback(args);
                });
                scope.$on('$destroy', handler);
            },

            notify: function(event, args) {
                $rootScope.$emit(event, args);
            }
    };
});