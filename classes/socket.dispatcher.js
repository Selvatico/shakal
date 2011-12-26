var container = require("./game.container").getContainer;
var util = require('util');

var controller = {
    joinGame:function (data, socket) {
        util.log("JOIN EVENT", data);
        var player = container.createPlyer(data.gameName, {socket:socket});
        container.toGame(data.gameId, data.gameName, player);
    },
    gameTurn:function (data, socket) {
        container.makeTurn(socket, data);
    }
};

module.exports = function (socketServer) {
    socketServer.sockets.on('connection', function (client) {
        util.log("NEW CONNECTION");
        client.on('message', function (res) {
            util.log("MESSAGE EVENT");
            try {
                var data = JSON.parse(res);
                controller[data.action](data, client);
            } catch (e) {
                console.log(e);
            }
        });

        client.on('disconnect', function () {
            //@todo add disconnect logic
            util.log("disconnect");
        });

    });
};
