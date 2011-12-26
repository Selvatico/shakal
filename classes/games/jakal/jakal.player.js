var JakalPlayer   = function () {
    this.pirates  = null;
    this.coins    = null;
    this.playerId = null;
    this.color    = null;
    this.socket   = null;
    this.init.apply(this, arguments);
};

JakalPlayer.prototype = {
    GAME_NAME:"JAKAL",
    init:function (conf) {
        for (var i in conf) {
            this[i] = conf[i];
        }
    },
    broadcastTo:function (to, event, data) {
        data.action = event;
        this.socket.broadcast.to(to).send(JSON.stringify(data));
    },
    socketSend:function (event, data) {
        data.action = event;
        this.socket.send(JSON.stringify(data));
    }
};

exports.getPlayer = function (config) {
    return new JakalPlayer(config);
};
