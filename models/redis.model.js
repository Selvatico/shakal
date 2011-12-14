var config  = require("../config/config");
var redisOpt= config.getConfig("redis");
var redisClient = require("redis").createClient(redisOpt['redisPort'], redisOpt['redisHost'], redisOpt['redisOpt']);

redisClient.saveGame = function () {

};

redisClient.loadSavedGame = function (uid, fn) {

};

exports.redisModel = redisClient;
