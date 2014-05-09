'use strict';

describe('Module: avaughan.logging', function() {
    var logger;
    var level;

    // load the controller's module
    beforeEach(module('avaughan.logging'));

    beforeEach(inject(function(avLog, avLevel) {
        logger = avLog;
        level = avLevel;
        console.log('avLogger injected', avLog);
        console.log('avLevel injected', JSON.stringify(avLevel), avLevel);
    }));

    afterEach(function() {
        //scope.$destroy();
    });

    it('should correctly get default values and injection should work', inject(function() {

        //check that injection works
        expect(logger).toBeDefined();
        expect(level).toBeDefined();

        //fetch the default log level
        //console.log('checking config default loglevel', logger.getConfig().loglevel);
        expect(logger.getConfig().loglevel).toEqual(level.INFO);

        //fetch a category that does not exist (should get default)
        //console.log('checking default level is transferred to non-registered channel');
        expect(logger.getLogLevel('unregisteredCategory')).toEqual(level.INFO);

        //fetch the example category
        expect(logger.getLogLevel('exampleCategory')).toEqual(level.ERROR);

        //fetch the $log injected
        //console.log('checking logger.$log is defined', logger.getLog());
        expect(logger.getLog()).toBeDefined();
    }));

    it('should handle thresholding', inject(function() {

        var log = logger.getLogger('unregisteredCategory');
        //console.log('got logger', log);

        var $logSpy = spyOn(log.getLog(), 'info');

        //console.log('level is', log.getLevel());
        expect(log.getLevel()).toEqual(level.INFO);

        //info is the default level so we should expect both to be called....
        //console.log('calling log.info', log);
        log.info('log.info from logger called!!!!', {});

        //check that we passed threshold and logged the message
        //console.log('testing $log call');
        expect($logSpy).toHaveBeenCalledWith('[unregisteredCategory] - INFO: log.info from logger called!!!!', {});

        //ok - now log something under threshold
        $logSpy = spyOn(log.getLog(), 'debug');
        log.debug('a debug message should not be printed');
        expect($logSpy).not.toHaveBeenCalledWith('[unregisteredCateogry] - DEBUG: a debug message should not be printed');
    }));

    it('should correctly handle configuration setting', inject(function() {

        //check that injection works
        expect(logger).toBeDefined();
        expect(level).toBeDefined();

        logger.setConfig({
            loglevel: level.DEBUG,
            category: {
                myCategory: level.WARN
            }
        });

        //fetch the default log level
        expect(logger.getConfig().loglevel).toEqual(level.DEBUG);

        //fetch a category that does not exist (should get default)
        //console.log('checking default level is transferred to non-registered channel');
        expect(logger.getLogLevel('unregisteredCategory')).toEqual(level.DEBUG);

        //fetch the configured category
        expect(logger.getLogLevel('myCategory')).toEqual(level.WARN);
    }));
});
