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
    },
    makeTurn : function (playerId, data) {
        console.log("make turn event");
    },
    backFromHeaven : function () {

    },
    addPlayer : function (player) {
        console.log("ADD PLAYER");
        var _self = this;
        if (!_self.players[player.playerId] && _self.freeColors.length > 0) {
            console.log("ADD DONE");
            player.color = _self.freeColors[0];
            _self.players[player.playerId] = player;
            player.socket.join(_self.socketRoom);
            player.socket.set("gameSettings", {player : player.playerId, gameId : _self.gameId, gameName : "JAKAL"});
            player.socketSend("joined", {result : true, board : _self.openBoard});
        } else {

        }
    }

};

exports.getGame = function (uid) {
    return new Jakal({gameId:uid});
};
exports.CLASS_NAME = "JAKAL";
