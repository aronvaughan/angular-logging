var myApp = angular.module('myApp', ['avaughan.logging']);

/**
 * configure the logging infrastructure
 */
myApp.config(function(avLogProvider, avLevel) {

    var myLogConfig = {
        //set a default log level - this will be used if someone logs under a category that is not defined below
        loglevel: avLevel.INFO, //TRACE, DEBUG, INFO, WARN, ERROR
        //these are the configured channels for logging - each channel can have it's own threshold
        //only log statements above the threshould will be output to the underlying $log
        category: {
            testDebugCategory: avLevel.DEBUG,
            testErrorCategory: avLevel.ERROR,
            testController: avLevel.WARN //all logging from the 'testController' controller will only be logged if .warn or above
        }
    };
    console.log('provider', avLogProvider);
    avLogProvider.$get().setConfig(myLogConfig);
});
