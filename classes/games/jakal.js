var Jakal = function () {
    this.gameId = null;
    this.createTime = null;
    this.status = "NEW";
    this.openBoard = [];
    this.closedBoard = [];
    this.deckObject= null;
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
    },
    initBoard : function () {
        var _self = this;
        _self.closedBoard = _self.deckObject.createPlayGround();
        //console.log(JSON.stringify(this.closedBoard));
    },
    killPirate : function () {

    },
    movePirate : function () {

    },
    backFromHeaven : function () {

    }
};

exports.getGame = function (uid) {
    return new Jakal({gameId:uid});
};
exports.CLASS_NAME = "JAKAL";
