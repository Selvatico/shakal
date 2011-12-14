var Jakal = function () {
    this.gameId = null;
    this.createTime = null;
    this.status = "NEW";
    this.init.apply(this, arguments);
};

Jakal.prototype = {
    GAME_NAME:"JAKAL",
    PLAYERS_LIMIT:4,
    PLAYERS_MINIMUM:2,
    init:function (conf) {
        for (var i in conf) {
            this[i] = conf[i];
        }
    }
};

exports.getGame = function (uid) {
    return new Jakal({gameId:uid});
};
exports.CLASS_NAME = "JAKAL";
