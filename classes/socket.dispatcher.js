var container = require("./game.container").getContainer;

var controller = {
    joinGame:function (data, socket) {
        var player = container.createPlyer(data.gameName, {socket:socket});
        container.joinGame(data.gameUID, data.gameName, player);
    },
    gameTurn:function (data, socket) {
        container.makeTurn(socket, data);
    }
};

module.exports = function (socketServer) {
    socketServer.on('connection', function (client) {
        client.on('message', function (res) {
            try {
                var data = JSON.parse(res);
                controller[data.action](data, client);
            } catch (e) {
                console.log(e);
            }
        });

        client.on('disconnect', function () {
            //@todo add disconnect logic
        });

    });
};
