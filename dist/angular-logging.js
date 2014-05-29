'use strict';
//http://stackoverflow.com/questions/19614545/how-can-i-add-some-small-utility-functions-to-my-angularjs-application
//http://stackoverflow.com/questions/15666048/angular-js-service-vs-provider-vs-factory
//http://briantford.com/blog/angular-bower
/**
 * namespace to avoid collisions with other libraries
 * @type {*|{}}
 */
var AVaughanLogging = AVaughanLogging || {};
/**
 * constants describing the current available logging levels
 * @type {{TRACE: number, DEBUG: number, INFO: number, WARN: number, ERROR: number}}
 */
AVaughanLogging.LogLevel = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  textValues: [
    'TRACE',
    'DEBUG',
    'INFO',
    'WARN',
    'ERROR'
  ],
  getText: function (code) {
    return this.textValues[code];
  }
};
/**
 * a config that is used if no logging config has been set on the logger....
 *
 * @type {{loglevel: number, category: {exampleCategory: number}}}
 */
AVaughanLogging.DefaultLogConfig = {
  loglevel: AVaughanLogging.LogLevel.INFO,
  category: { exampleCategory: AVaughanLogging.LogLevel.ERROR }
};
/**
 * an instance of a logger
 * @param $log - the underlying log object (expects angular $log object)
 * @param level - the threshold that has been configured for this instance (see Log.setConfig and AVaughanLogging.DefaultLogConfig)
 * @param category - the name/category/channel that this log instance is identified by - should match the config category name for setting the threashold
 * @constructor
 */
AVaughanLogging.Logger = function ($log, logInstance, category) {
  this.name = 'AVaughanLogging.Logger';
  this.$log = $log;
  //this.level = logInstance.this.getLogLevel(this.category);
  this.category = category;
  var Level = AVaughanLogging.LogLevel;
  this.debug = function (message, args) {
    if (this.getLevel() <= Level.DEBUG) {
      $log.debug('[' + this.category + '] - DEBUG: ' + message, args);
    }
  };
  this.info = function (message, args) {
    //console.log('log.info called', message, args, this.level);
    if (this.getLevel() <= Level.INFO) {
      $log.info('[' + this.category + '] - INFO: ' + message, args);
    }
  };
  this.warn = function (message, args) {
    if (this.getLevel() <= Level.WARN) {
      $log.warn('[' + this.category + '] - WARN: ' + message, args);
    }
  };
  this.error = function (message, args) {
    if (this.getLevel() <= Level.ERROR) {
      $log.error('[' + this.category + '] - ERROR ' + message, args);
    }
  };
  this.getLog = function () {
    return this.$log;
  };
  this.getLevel = function () {
    return logInstance.getLogLevel(this.category);
  };
  this.getCategory = function () {
    return this.category;
  };
};
/**
 * Main logging api
 * @param $log
 * @constructor
 */
AVaughanLogging.Log = function ($log) {
  this.name = 'AVaughanLogging.Log';
  this.config = AVaughanLogging.DefaultLogConfig;
  var configSet = false;
  this.$log = $log;
  /**
     * sets the logging levels and general settings
     *
     * @param config
     */
  this.setConfig = function (config) {
    this.config = config;
    if (!configSet) {
      configSet = true;
      this.configToConsole();
    } else {
      if ($log) {
        $log.warn('avLog setConfig called multiple times', config);
      } else {
        console.log('WARN: avLog setConfig called multiple times, $log was null', config);
      }
    }
  };
  /**
     * get the current levels and general settings
     * @returns {*}
     */
  this.getConfig = function () {
    return this.config;
  };
  /**
     * for a given category return the threshold level for logging for that category
     * or if not explicitly set the default configured log level
     *
     * @param category - the category or name of the logger (see getLogger() )
     * @returns {*}
     */
  this.getLogLevel = function (category) {
    var level = this.getConfig().loglevel;
    //console.log('log level', this.config.category, this.config.category[category]);
    if (this.getConfig().category[category]) {
      level = this.getConfig().category[category];
    }
    //console.log('log level for category', category, level, this.getConfig());
    return level;
  };
  /**
     * create a logger with a given category/name
     * each category/name may have it's own threshold level set in the config
     * only messages above the configured threshold will be logged
     *
     * @param category - a human readable name for the logger
     * @returns {Logger}
     */
  this.getLogger = function (category) {
    var myLogger = new AVaughanLogging.Logger(this.$log, this, category);
    return myLogger;
  };
  /**
     * dump the current log config to the console
     */
  this.configToConsole = function () {
    var config = this.getConfig();
    console.log('-------- Logging Config Start >> --------------');
    console.log('Default Level: ' + AVaughanLogging.LogLevel.getText(config.loglevel));
    for (var category in config.category) {
      console.log('CATEGORY: ' + category + ' VALUE: ' + AVaughanLogging.LogLevel.getText(config.category[category]));
    }
    console.log('raw object', this.getConfig());
    console.log('-------- << Logging Config End ----------------');
  };
  this.getLog = function () {
    return this.$log;
  };
};
/**
 * create a module named avaughan-logging
 * provides 2 objects
 *
 * 'avLevel' - which has DEBUG, TRACE, INFO, WARN, ERROR   levels
 * 'avLogging' - which provides the main logging api - see documentation on AVaughanLogging.Log class
 *
 *  how to use:
 *
 *  angular.module('my-app', ['avaughan-logging'])
 */
angular.module('avaughan.logging', []).constant('avLevel', AVaughanLogging.LogLevel).factory('avLog', [
  '$log',
  function ($log) {
    console.log('avLogging instantiated', $log);
    //AV for some reason we are getting multiple of these and we can't get a handle to the AVLog in factories, force a singleton
    if (AVaughanLogging.logInstance === undefined) {
      AVaughanLogging.logInstance = new AVaughanLogging.Log($log);
    } else {
      //angular will call this once with an undefined log.... then later call again with a valid one....
      AVaughanLogging.logInstance.$log = $log;
    }
    return AVaughanLogging.logInstance;
  }
]);
/**
 * abstract away the angular bootstrapping that sometimes provides an array of providers and other times
 *
 * @param avLogProvider
 * @param logConfig
 * @returns {*}
 */
AVaughanLogging.get = function (avLogProvider, logConfig) {
  return avLogProvider.$get[1]().setConfig(logConfig);
};