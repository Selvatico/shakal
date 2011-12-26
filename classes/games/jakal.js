var util = require('util');

var Jakal = function () {
    this.gameId = null;
    this.createTime = null;
    this.status = "NEW";
    this.openBoard = [];
    this.closedBoard = [];
    this.deckObject= null;
    this.deathPool = null;
    this.players = {};
    this.freeColors = ["red", "green", "pink", "black"];
    this.ships = null;
    this.pirates = [];
    this.socketRoom = "";
    this.init.apply(this, arguments);
};

Jakal.prototype = {
    GAME_NAME:"JAKAL",
    PLAYERS_LIMIT:4,
    PLAYERS_MINIMUM:2,
    init:function (conf) {
        this.deckObject = require("./jakal/jakal.cards").getCards();
        for (var i in conf) {
            this[i] = conf[i];
        }
        this.socketRoom = "JAKAL:" + this.gameId;
    },
    newJoined : function () {

    },
    initBoard : function () {
        var _self = this;
        _self.closedBoard = _self.deckObject.createPlayGround();
        _self.openBoard   = _self.deckObject.createEmptyDeck();
        _self.initGameObjects();
    },
    initGameObjects : function () {
        var _self = this;
        _self.ships = [
            {color : "red",   x : 6 , y : 0,   piratesOnBoard : 3, current : "6-0",
                alowed:["2-0", "3-0", "4-0", "5-0", "6-0", "7-0", "8-0", "9-0", "10-0"]
            },
            {color : "pink",  x : 0,  y : 6,   piratesOnBoard : 3, current : "0-6",
                alowed:["0-2", "0-3", "0-4", "0-5", "0-6", "0-7", "0-8", "0-9", "0-10"]
            },
            {color : "green", x : 12, y : 6,   piratesOnBoard : 3, current : "12-6",
                alowed:["12-2", "12-3", "12-4", "12-5", "12-6", "12-7", "12-8", "12-9", "12-10"]
            },
            {color : "black", x : 6,  y : 12,  piratesOnBoard : 3, current : "6-12",
                alowed:["2-12", "3-12", "4-12", "5-12", "6-12", "7-12", "8-12", "9-12", "10-12"]
            }
        ];
        _self.pirates = [

        ];
    },
    makeTurn : function (playerId, data) {
        console.log("make turn event");
    },
    backFromHeaven : function () {

    },
    addPlayer : function (player) {

        var _self = this;
        if (!_self.players[player.playerId] && _self.freeColors.length > 0) {
            player.color = _self.freeColors[0];
            _self.players[player.playerId] = player;
            player.socket.join(_self.socketRoom);
            player.socket.set("gameSettings", {player : player.playerId, gameId : _self.gameId, gameName : "JAKAL"});
            player.socketSend("joined",
                {
                    result:true,
                    board:_self.openBoard,
                    ships:_self.ships,
                    pirates : _self.pirates,
                    color : player.color
                }
            );
            util.log("New player added: " + player.playerId);
        } else {

        }
    }

};

exports.getGame = function (uid) {
    return new Jakal({gameId:uid});
};
exports.CLASS_NAME = "JAKAL";
