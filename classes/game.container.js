var fs         = require('fs');
var config     = require("../config/config");
var redisModel = require("../models/redis.model").redisModel;
var events     = require('events');
var util       = require("util");
var path       = require('path');
var md5        = require('../models/md5.model');

var GameContainer = function() {
    this.gamesClasses = {};
    this.gamesObjects = {};
    this.checkedPlayers = {};
    this.stats = null;
    this.countGames = 0;
    events.EventEmitter.call(this);
};

util.inherits(GameContainer, events.EventEmitter);

/**
 * Create unique ID for game object
 * @param length
 */
GameContainer.prototype._createUID = function (length) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var randomstring = '';
    for (var i = 0; i < length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
};

/**
 * Preload all classes and save exist or notexist classes
 * @param app
 */
GameContainer.prototype.loadGamesClasses = function (app) {
    var _self = this;
    fs.readdir(__dirname + '/games', function (err, files) {
        if (err) throw err;
        files.forEach(function (file) {
            var cls = require(__dirname + '/games/' + file.replace(".js", "")).CLASS_NAME;
            if (cls) {
                _self.gamesClasses[cls] = true;
            } else {
                util.log("undefined class name for: " + file);
            }
        });
        _self.emit("loadEnd", true);
    });

};

/**
 * Create new game object class or restore config for
 * not saved game. Emits "gameCreated" event on finish
 * @param gameName
 * @param restore
 * @param restoreId
 */
GameContainer.prototype.createGame = function (gameName, restore, restoreId) {
    var _self = this;
    var gameNameUP = gameName.toUpperCase();
    if (_self.gamesClasses[gameName.toUpperCase()]) {
        var uid = (!restoreId) ? _self._createUID(10) : restoreId;
        var newGame = require(__dirname + '/games/' + gameName.toLowerCase()).getGame(uid);
        if (!_self.gamesObjects[gameNameUP]) {
            _self.gamesObjects[gameNameUP] = {};
        }
        _self.gamesObjects[gameNameUP][uid] = newGame;
        if (!restore) {
            //_self.emit("gameCreated", newGame);
            return newGame;
        } else {
            redisModel.loadSavedGame(restoreId,
                function (res, config) {
                    if (res) {
                        newGame.setConfig(config);
                        _self.emit("gameCreated", newGame);
                    }
                });
        }
    } else {
        util.log("Class " + gameName + " not defined");
    }
};

/**
 * Join player for game
 * @param gameUID
 * @param gameName
 * @param player
 */
GameContainer.prototype.joinGame = function (gameUID, gameName, player) {
    var _self = this;
    var findGame = _self.gamesObjects[gameName][gameUID];
    if (findGame) {
        findGame.addPlayer(player);
        return true;
    }
    return false;
};

/**
 * Create player for particular game
 * @param gameName
 * @param config
 */
GameContainer.prototype.createPlyer = function (gameName, config) {
    var _self = this;
    var uid = _self._createUID(12);
    var allowCreate = false;
    var pathJs = __dirname + '/games/' + gameName.toLowerCase() + ".player";
    if (path.existsSync(pathJs + ".js")) {
        allowCreate = true;
    }
    if (allowCreate) {
        config.playerId = uid;
        var player =  require(pathJs).getPlayer(config);
        //_self.checkedPlayers[uid] = player;
        return player;
    } else {
        util.log("undefined player class name");
    }
};


GameContainer.prototype.makeTurn = function (socket, data) {
    var _self = this;
    socket.get("gameSettings", function (err, memory){
        if (memory != null) {
            memory = JSON.parse(memory);
            var findGame = _self.gamesObjects[memory.gameName][memory.gameId];
            if (findGame) {
                findGame.makeTurn(memory.playerId, data);
            }
        }
    });

};

var appContainer = new GameContainer();

exports.getContainer = appContainer;


