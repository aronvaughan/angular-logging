angular.module('myApp').controller('testController', ['$scope', 'avLog',
    function($scope, avLog) {
        var logger = avLog.getLogger('testController');
        logger.warn("this is a warning !!!!", {
            someObject: "a test object"
        }); //this will be logged - the configured level is WARN
        logger.debug("this is a debug statement [should be hidden!!!]]"); // this will not be logged - the configured level is WARN
    }
]);
