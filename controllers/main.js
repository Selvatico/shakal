var container = require("../classes/game.container").getContainer;

module.exports = {
    index:function (req, res) {

    },
    game:function (req, res) {

    },
    ajxDesk : function (request, res) {
        return container.gamesObjects['JAKAL'][request.body.id];
        //return {ex : 22222};
    },
    ajxCreateGame:function (req, res) {
        var newGame = container.createGame("jakal", false, null);
        console.log(newGame);
        newGame.initBoard();
        return {id : newGame.gameId};
    }
};